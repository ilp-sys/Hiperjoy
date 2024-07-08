use crate::mouse_control::MouseControl;

use crate::leaprs::connection::{Connection, ConnectionConfig};
use crate::leaprs::events::tracking_event::EventRef;

pub fn leap_hand_sensor() {
    let mouse = MouseControl::new();

    let mut c = Connection::create(ConnectionConfig::default()).unwrap();
    c.open().unwrap();
    for _ in 0..10 {
        if let Ok(msg) = c.poll(1000) {
            match msg.event() {
                EventRef::Tracking(e) => println!("{} hand(s)", e.hands().len()),
                _ => {}
            }
        }
    }
}
