use crate::leap_hand_sensor::leap_hand_sensor;
use gtk::prelude::*;
use gtk::{
    gio, glib, Application, ApplicationWindow, Box as GtkBox, Button, Orientation, ScrolledWindow,
    TextView,
};
use std::sync::mpsc;
use std::time::Duration;

use crate::build_ui::glib::ControlFlow::Continue;

fn append_log(log_panel: &TextView, message: &str) {
    let buffer = log_panel.buffer();
    buffer.insert(&mut buffer.end_iter(), message);
    buffer.insert(&mut buffer.end_iter(), "\n");
}

pub fn build_ui(app: &Application) {
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

    //let (tx, rx) = mpsc::channel();
    let (tx, rx) = mpsc::channel();
    gio::spawn_blocking(move || {
        leap_hand_sensor(tx);
    });

    let log_panel_clone = log_panel.clone();
    glib::MainContext::default().spawn_local(async move {
        loop {
            // Check for messages in a non-blocking way
            while let Ok(log_message) = rx.try_recv() {
                // Clone the log_panel for use in the async block
                let log_panel_clone_inner = log_panel_clone.clone();
                // Execute the UI update in the main thread
                glib::MainContext::default().spawn_local(async move {
                    let buffer = log_panel_clone_inner
                        .buffer();
                    buffer.insert_at_cursor(&log_message);
                });
            }
            // Sleep for a short duration to avoid busy-waiting
            glib::timeout_future(Duration::from_millis(100)).await;
        }
    });

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
