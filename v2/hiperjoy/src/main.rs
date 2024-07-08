mod mouse_control;
mod leap_hand_sensor;
mod build;

use gtk::prelude::*;
use gtk::{glib, Application};

const APP_ID: &str = "hiperjoy";

use build::build_ui;

fn main() -> glib::ExitCode {
    let app = Application::builder().application_id(APP_ID).build();

    app.connect_activate(build_ui);

    app.run()
}
