use crate::mouse_control::MouseControl;
use std::time::SystemTime;

use leaprs::*;
use std::time::Duration;
use throbber::Throbber;

pub fn leap_hand_sensor() {
    let mut mouse = MouseControl::new();

    let mut connection =
        Connection::create(ConnectionConfig::default()).expect("Failed to create connection");
    connection.open().expect("Failed to open the connection");

    connection.wait_for("Connecting to the service...".to_string(), |e| match e {
        EventRef::Connection(e) => {
            let flags = e.flags();
            Msg::Success(format!("Connected. Service state: {:?}", flags))
        }
        _ => Msg::None,
    });

    connection.wait_for("Waiting for a hand...".to_string(), |e| match e {
        EventRef::Tracking(e) => {
            if !e.hands().is_empty() {
                Msg::Success("Got a hand".to_string())
            } else {
                Msg::None
            }
        }
        _ => Msg::None,
    });

    connection.wait_for("Close the hand".to_string(), |e| match e {
        EventRef::Tracking(e) => {
            if let Some(hand) = e.hands().first() {
                let grab_strength = hand.grab_strength;
                if grab_strength >= 1.0 {
                    Msg::Success("The hand is closed".to_string())
                } else {
                    Msg::Progress(format!("Close the hand {:.0}%", grab_strength * 100.0))
                }
            } else {
                Msg::Progress("Close the hand".to_string())
            }
        }
        _ => Msg::None,
    });

    connection.wait_for("Open the hand".to_string(), |e| match e {
        EventRef::Tracking(e) => {
            if let Some(hand) = e.hands().first() {
                let ungrab_strength = 1.0 - hand.grab_strength;
                if ungrab_strength >= 0.999 {
                    Msg::Success("The hand is opened".to_string())
                } else {
                    Msg::Progress(format!("Open the hand {:.0}%", ungrab_strength * 100.0))
                }
            } else {
                Msg::Progress("Open the hand".to_string())
            }
        }
        _ => Msg::None,
    });

    let mut is_dragging = false;
    loop {
        if let Ok(msg) = connection.poll(100) {
            match msg.event() {
                EventRef::Tracking(e) => {
                    for hand in e.hands() {
                        let palm = hand.palm();
                        let pos = palm.position();
                        let x = pos.x;
                        let y = pos.y;
                        let z = pos.z;
                        if hand.pinch_distance < 20.0 {
                            mouse.perform_operation(crate::mouse_control::MouseOperation::ClickLeft);
                        } else if hand.grab_strength > 0.9 {
                            if !is_dragging {
                                mouse.perform_operation(crate::mouse_control::MouseOperation::PressLeft);
                                is_dragging = true;
                            }
                            mouse.move_mouse(x as i32 * 3, z as i32 * 3, enigo::Coordinate::Abs);
                        } else {
                            if is_dragging {
                                mouse.perform_operation(crate::mouse_control::MouseOperation::ReleaseLeft);
                                is_dragging = false;
                            }
                            mouse.move_mouse(x as i32 * 3, z as i32 * 3, enigo::Coordinate::Abs);
                        }
                        //println!("{} {} {}", x, y, z);
                        let pd = hand.pinch_distance;
                        let ga = hand.grab_angle;
                        let ps = hand.pinch_strength;
                        let gs = hand.grab_strength;
                        println!("{} {} {} {}", pd, ga, ps, gs);
                    }
                }
                _ => {}
            }
        }
    }

    // let start = SystemTime::now();
    // let mut clock_synchronizer = ClockRebaser::create().expect("Failed to create clock sync");
    //
    // loop {
    //     // Note: If events are not polled, the frame interpolation fails with "is not seer"
    //     let cpu_time = SystemTime::now().duration_since(start).unwrap().as_micros() as i64;
    //     clock_synchronizer
    //         .update_rebase(cpu_time, leap_get_now())
    //         .expect("Failed to update rebase");
    //
    //     std::thread::sleep(Duration::from_millis(10));
    //
    //     let cpu_time = SystemTime::now().duration_since(start).unwrap().as_micros() as i64;
    //
    //     let target_frame_time = clock_synchronizer
    //         .rebase_clock(cpu_time)
    //         .expect("Failed to rebase clock");
    //
    //     let requested_size = connection
    //         .get_frame_size(target_frame_time)
    //         .expect("Failed to get requested size");
    //
    //     let frame = connection
    //         .interpolate_frame(target_frame_time, requested_size)
    //         .expect("Failed to interpolate frame");
    //     let hands = frame.hands();
    //     for hand in hands {
    //         let palm = hand.palm();
    //         let pos = palm.position();
    //         let x = pos.x;
    //         let y = pos.y;
    //         let z = pos.z;
    //         println!("{} {} {}", x, y, z);
    //     }
    // }
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum Msg {
    None,
    Success(String),
    Progress(String),
    Failure(String),
}

trait WaitFor {
    fn wait_for<F>(&mut self, message: String, condition: F)
    where
        F: Fn(&EventRef) -> Msg;
}

impl WaitFor for Connection {
    fn wait_for<F>(&mut self, message: String, condition: F)
    where
        F: Fn(&EventRef) -> Msg,
    {
        let mut throbber = Throbber::new().interval(Duration::from_millis(100));

        throbber.start_with_msg(message);

        loop {
            if let Ok(message) = self.poll(100) {
                match condition(&message.event()) {
                    Msg::None => {}
                    Msg::Success(message) => {
                        throbber.success(message);
                        break;
                    }
                    Msg::Progress(message) => {
                        throbber.change_message(message);
                    }
                    Msg::Failure(message) => {
                        throbber.fail(message);
                        break;
                    }
                }
            }
        }
        throbber.end();
    }
}
