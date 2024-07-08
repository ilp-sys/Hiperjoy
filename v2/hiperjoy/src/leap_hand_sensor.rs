mod bindings {
    include!(concat!(env!("OUT_DIR"), "/bindings.rs"));
}

use bindings::{millisleep, GetDeviceProperties, GetFrame, IsConnected, OpenConnection};
use std::ffi::CString;
use std::thread::sleep;
use std::time::Duration;

use crate::mouse_control::MouseControl;

pub fn leap_hand_sensor() {
    let mut mouse = MouseControl::new();
    unsafe {
        OpenConnection();

        while !IsConnected {
            millisleep(100);
        }

        println!("Leap2 Connected!");

        let device_props = GetDeviceProperties();
        if !device_props.is_null() {
            let serial = CString::from_raw((*device_props).serial as *mut i8);
            println!("Using device {}.", serial.to_str().unwrap());
            std::mem::forget(serial);
        }

        let mut last_frame_id: i64 = -1;
        loop {
            let frame = GetFrame();
            if !frame.is_null() {
                let frame_ref = &*frame;
                if last_frame_id > frame_ref.tracking_frame_id {
                    break;
                }
                last_frame_id = frame_ref.tracking_frame_id;
                let number_of_hands = frame_ref.nHands;

                println!("Frame {} with {} hands.", last_frame_id, number_of_hands);

                for h in 0..number_of_hands {
                    let hand = frame_ref.pHands.wrapping_add(h as usize);
                    let id = (*hand).id;
                    let position = (*hand).palm.position;
                    let x = position.__bindgen_anon_1.__bindgen_anon_1.x;
                    let y = position.__bindgen_anon_1.__bindgen_anon_1.y;
                    let z = position.__bindgen_anon_1.__bindgen_anon_1.z;

                    mouse.move_mouse(x as i32, z as i32, enigo::Coordinate::Abs);

                    println!(
                        "    Hand id {} is a {} hand with position ({}, {}, {}).",
                        id,
                        match (*hand).type_ {
                            eLeapHandType_Left => "left",
                            eLeapHandType_Right => "right",
                        },
                        x,
                        y,
                        z,
                    );
                }
            }

            sleep(Duration::from_millis(100));
        }
    }
}
