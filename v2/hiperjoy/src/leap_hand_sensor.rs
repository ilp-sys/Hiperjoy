use crate::mouse_control::{MouseControl, MouseOperation};

use leaprs::*;
use std::time::{Duration, Instant};
use throbber::Throbber;

fn connecting() -> Connection {
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

pub fn leap_hand_sensor() {
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
                            println!("A new hand detected {}", prev_hand_id);
                        }
                        let palm = hand.palm();
                        let pos = palm.position();
                        let x = pos.x;
                        let y = pos.y;
                        let z = pos.z;
                        //println!("{} {} {}", x, y, z);


                        if index_pointing_upwards(&mut hand.digits()) {
                            println!("mouse scroll -5");
                            mouse.perform_operation(MouseOperation::Scroll {
                                vector: -3,
                                direction: enigo::Axis::Vertical,
                            });
                        } else if pinky_pointing_upwards(&mut hand.digits()) {
                            println!("mouse scroll 5");
                            mouse.perform_operation(MouseOperation::Scroll {
                                vector: 3,
                                direction: enigo::Axis::Vertical,
                            });
                        } else if hand.pinch_distance < 20.0 {
                            if last_click_time.elapsed() >= click_debounce_duration {
                                mouse.perform_operation(MouseOperation::ClickLeft);
                                println!("mouse click left");
                                last_click_time = Instant::now();
                            }
                            else {
                                println!("mouse click debounced");
                            }
                        } else if hand.grab_strength > 0.9 {
                            if !is_dragging {
                                mouse.perform_operation(MouseOperation::PressLeft);
                                is_dragging = true;
                                println!("mouse press left");
                            }
                            mouse.move_mouse(x as i32 * -4, z as i32 * 4, enigo::Coordinate::Abs);
                        } else {
                            if is_dragging {
                                mouse.perform_operation(MouseOperation::ReleaseLeft);
                                println!("mouse release left");
                                is_dragging = false;
                            }
                            mouse.perform_operation(MouseOperation::Move {
                                x: x as i32 * -4,
                                y: z as i32 * 4,
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
