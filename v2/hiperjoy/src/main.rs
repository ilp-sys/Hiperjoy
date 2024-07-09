// use gtk::prelude::*;
// use gtk::{glib, Application};

const APP_ID: &str = "hiperjoy";

//use build_ui::build_ui;

// fn main() -> glib::ExitCode {
//     let app = Application::builder().application_id(APP_ID).build();
//     app.connect_activate(build_ui);
//     app.run()
// }

use hiperjoy::leap_hand_sensor::leap_hand_sensor;

fn main() {
    leap_hand_sensor();
}
