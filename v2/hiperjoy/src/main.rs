use gtk::prelude::*;
use gtk::{glib, Application};
use hiperjoy::build_ui::build_ui;

const APP_ID: &str = "HIPERJOY";

fn main() -> glib::ExitCode {
    let app = Application::builder().application_id(APP_ID).build();
    app.connect_activate(build_ui);
    app.run()
}
