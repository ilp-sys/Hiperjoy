extern crate enigo;

use enigo::{Axis, Button, Coordinate, Enigo, Mouse, Settings, Direction};

pub struct MouseControl {
    controller: Enigo,
}

impl MouseControl {
    pub fn new() -> Self {
        MouseControl {
            controller: Enigo::new(&Settings::default()).unwrap(),
        }
    }

    pub fn move_mouse(&mut self, x: i32, y: i32, coordinate: Coordinate) {
        if let Err(e) = self.controller.move_mouse(x, y, coordinate) {
            eprintln!("Error moving mouse: {:?}", e);
        }
    }

    pub fn scroll_mouse(&mut self, vector: i32, direction: Axis) {
        if let Err(e) = self.controller.scroll(vector, direction) {
            eprintln!("Error scrolling mouse: {:?}", e);
        }
    }

    pub fn click_mouse(&mut self, button: Button) {
        if let Err(e) = self.controller.button(button, Direction::Click) {
            eprintln!("Error clicking mouse: {:?}", e);
        }
    }

    pub fn press_mouse(&mut self, button: Button) {
        if let Err(e) = self.controller.button(button, Direction::Press) {
            eprintln!("Error pressing mouse button: {:?}", e);
        }
    }

    pub fn release_mouse(&mut self, button: Button) {
        if let Err(e) = self.controller.button(button, Direction::Release) {
            eprintln!("Error releasing mouse button: {:?}", e);
        }
    }

    pub fn get_position(&self) -> (i32, i32) {
        match self.controller.location() {
            Ok(pos) => pos,
            Err(e) => {
                eprintln!("Error getting mouse position: {:?}", e);
                (0, 0)
            }
        }
    }

    pub fn perform_operation(&mut self, operation: MouseOperation) {
        match operation {
            MouseOperation::Move { x, y, coordinate } => self.move_mouse(x, y, coordinate),
            MouseOperation::Scroll { vector, direction } => self.scroll_mouse(vector, direction),
            MouseOperation::ClickLeft => self.click_mouse(Button::Left),
            MouseOperation::ClickRight => self.click_mouse(Button::Right),
            MouseOperation::PressLeft => self.press_mouse(Button::Left),
            MouseOperation::PressRight => self.press_mouse(Button::Right),
            MouseOperation::ReleaseLeft => self.release_mouse(Button::Left),
            MouseOperation::ReleaseRight => self.release_mouse(Button::Right),
        }
    }
}
pub enum MouseOperation {
    Move {
        x: i32,
        y: i32,
        coordinate: Coordinate,
    },
    Scroll {
        vector: i32,
        direction: Axis,
    },
    ClickLeft,
    ClickRight,
    PressLeft,
    PressRight,
    ReleaseLeft,
    ReleaseRight,
}

