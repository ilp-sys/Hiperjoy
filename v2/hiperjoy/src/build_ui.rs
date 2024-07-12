use crate::leap_hand_sensor::{connecting, leap_hand_sensor};
use gtk::prelude::*;
use gtk::{
    gio, Application, ApplicationWindow, Box as GtkBox, Button, Orientation, ScrolledWindow,
    TextView,
};

fn append_log(log_panel: &TextView, message: &str) {
    let buffer = log_panel.buffer();
    buffer.insert(&mut buffer.end_iter(), message);
    buffer.insert(&mut buffer.end_iter(), "\n");
}

pub fn build_ui(app: &Application) {
    gio::spawn_blocking(|| {
        leap_hand_sensor();
    });
    let button = Button::builder()
        .label("deactivate")
        .margin_top(12)
        .margin_bottom(12)
        .margin_start(12)
        .margin_end(12)
        .build();

    let log_panel = TextView::new();
    log_panel.set_editable(false);
    log_panel.set_cursor_visible(false);

    let scrolled_window = ScrolledWindow::builder()
        .child(&log_panel)
        .vexpand(true)
        .build();

    let vbox = GtkBox::new(Orientation::Vertical, 0);
    vbox.append(&scrolled_window);
    vbox.append(&button);

    button.connect_clicked(move |button| {
        let current_label = button.label().expect("failed to get button label");
        if current_label == "activate" {
            button.set_label("deactivate");
            append_log(&log_panel, "leap2 activate");
        } else {
            button.set_label("activate");
            append_log(&log_panel, "leap2 activate");
        }
    });

    let window = ApplicationWindow::builder()
        .application(app)
        .title("HIPERJOY")
        .child(&vbox)
        .build();

    window.present();
}
