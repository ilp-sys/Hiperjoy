mod mouse_control;
mod leap_hand_sensor;
mod build_ui;
mod safety;
mod leap_connection;
mod connection_message;
mod connection_info;
mod connection_status;

// use gtk::prelude::*;
// use gtk::{glib, Application};

const APP_ID: &str = "hiperjoy";

//use build_ui::build_ui;

// fn main() -> glib::ExitCode {
//     let app = Application::builder().application_id(APP_ID).build();
//     app.connect_activate(build_ui);
//     app.run()
// }

use leap_hand_sensor::leap_hand_sensor;

fn main() {
    leap_hand_sensor();
}
