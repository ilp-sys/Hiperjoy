use crate::mouse_control::{MouseControl, MouseOperation};

use leaprs::*;
use std::time::{Duration, Instant};
use throbber::Throbber;

use std::sync::mpsc;

pub fn connecting() -> Connection {
    let mut connection = Connection::create(ConnectionConfig::default()).expect("");
    connection.open().expect("Failed to open the connection");

    connection.wait_for("Connecting to the service...".to_string(), |e| match e {
        EventRef::Connection(e) => {
            let flags = e.flags();
            Msg::Success(format!("Connected. Service state: {:?}", flags))
        }
        _ => Msg::None,
    });

    connection.wait_for("Waiting for a device...".to_string(), |e| match e {
        EventRef::Device(e) => {
            let device_info = e
                .device()
                .open()
                .expect("Failed to open the device")
                .get_info()
                .expect("Failed to get device info");

            let serial = device_info
                .serial()
                .expect("Failed to get the device serial");

            Msg::Success(format!("Got the device {}", serial))
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

    connection
}

pub fn index_pointing_upwards(digits: &mut [DigitRef; 5]) -> bool {
    let index = digits[1].is_extended == 1;
    let middle = digits[2].is_extended == 1;
    let ring = digits[3].is_extended == 1;
    let pinky = digits[4].is_extended == 1;

    index && !middle && !ring && !pinky
}

pub fn pinky_pointing_upwards(digits: &mut [DigitRef; 5]) -> bool {
    let index = digits[1].is_extended == 1;
    let middle = digits[2].is_extended == 1;
    let ring = digits[3].is_extended == 1;
    let pinky = digits[4].is_extended == 1;

    pinky && !index && !middle && !ring
}

pub fn leap_hand_sensor(tx: mpsc::Sender::<String>) {
    let mut mouse = MouseControl::new();
    let mut connection = connecting();

    let mut is_dragging = false;
    let mut prev_hand_id = 0;
    let mut last_click_time = Instant::now();
    let click_debounce_duration = Duration::from_millis(300);
    loop {
        if let Ok(msg) = connection.poll(100) {
            match msg.event() {
                EventRef::Tracking(e) => {
                    for hand in e.hands() {
                        if prev_hand_id != hand.id {
                            prev_hand_id = hand.id;
                            //println!("A new hand detected {}", prev_hand_id);
                            let _ = tx.send("A new hand detected".to_string());
                        }
                        let palm = hand.palm();
                        let pos = palm.position();
                        let x = pos.x;
                        let y = pos.y;
                        let z = pos.z;
                        //println!("{} {} {}", x, y, z);

                        if index_pointing_upwards(&mut hand.digits()) {
                            let _ = tx.send("mouse scroll -1".to_string());
                            mouse.perform_operation(MouseOperation::Scroll {
                                vector: -1,
                                direction: enigo::Axis::Vertical,
                            });
                        } else if pinky_pointing_upwards(&mut hand.digits()) {
                            //println!("mouse scroll 1");
                            let _ = tx.send("mouse scroll 1".to_string());
                            mouse.perform_operation(MouseOperation::Scroll {
                                vector: 1,
                                direction: enigo::Axis::Vertical,
                            });
                        } else if hand.grab_strength > 0.9 {
                            if !is_dragging {
                                mouse.perform_operation(MouseOperation::PressLeft);
                                is_dragging = true;
                                let _ = tx.send("mouse press left".to_string());
                            }
                            mouse.perform_operation(MouseOperation::Move {
                                x: x as i32 * 4,
                                y: y as i32 * -4,
                                coordinate: enigo::Coordinate::Abs,
                            });
                        } else if hand.pinch_distance < 15.0 {
                            if last_click_time.elapsed() >= click_debounce_duration {
                                mouse.perform_operation(MouseOperation::ClickLeft);
                                let _ = tx.send("mouse click left".to_string());
                                last_click_time = Instant::now();
                            } else {
                                let _ = tx.send("mouse click debounced".to_string());
                            }
                        } else {
                            if is_dragging {
                                mouse.perform_operation(MouseOperation::ReleaseLeft);
                                let _ = tx.send("mouse release left".to_string());
                                is_dragging = false;
                            }
                            mouse.perform_operation(MouseOperation::Move {
                                x: x as i32 * 4,
                                y: y as i32 * -4,
                                coordinate: enigo::Coordinate::Abs,
                            });
                        }
                    }
                }
                _ => {}
            }
        }
    }
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
