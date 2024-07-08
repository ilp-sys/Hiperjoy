use std::{ffi::CStr, fmt::Display};

use leap_sys::*;
use num_enum::{FromPrimitive, IntoPrimitive};

#[derive(Debug, Clone, Copy, Eq, PartialEq, IntoPrimitive, FromPrimitive)]
#[repr(i32)]
#[doc = " Device hardware types. @since 3.0.0"]
pub enum DevicePID {
    #[doc = " An unknown device that is compatible with the tracking software. @since 3.1.3"]
    #[num_enum(default)]
    Unknown = _eLeapDevicePID_eLeapDevicePID_Unknown,
    #[doc = " The Leap Motion Controller (the first consumer peripheral). @since 3.0.0"]
    Peripheral = _eLeapDevicePID_eLeapDevicePID_Peripheral,
    #[doc = " Internal research product codename \"Dragonfly\". @since 3.0.0"]
    Dragonfly = _eLeapDevicePID_eLeapDevicePID_Dragonfly,
    #[doc = " Internal research product codename \"Nightcrawler\". @since 3.0.0"]
    Nightcrawler = _eLeapDevicePID_eLeapDevicePID_Nightcrawler,
    #[doc = " Research product codename \"Rigel\". @since 4.0.0"]
    Rigel = _eLeapDevicePID_eLeapDevicePID_Rigel,
    #[doc = " The Ultraleap Stereo IR 170 (SIR170) hand tracking module. @since 5.3.0"]
    SIR170 = _eLeapDevicePID_eLeapDevicePID_SIR170,
    #[doc = " The Ultraleap 3Di hand tracking camera. @since 5.3.0"]
    Leap3Di = _eLeapDevicePID_eLeapDevicePID_3Di,
    #[doc = " An invalid device type. Not currently in use. @since 3.1.3"]
    Invalid = _eLeapDevicePID_eLeapDevicePID_Invalid,
}

impl DevicePID {
    pub fn to_cstr(&self) -> &'static CStr {
        unsafe {
            let str = LeapDevicePIDToString(*self as eLeapDevicePID);
            CStr::from_ptr(str)
        }
    }
}

impl Display for DevicePID {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        let cstr = self.to_cstr().to_str().unwrap_or("Invalid");
        write!(f, "{}", cstr)
    }
}

#[cfg(test)]
mod tests {
    use crate::tests::*;

    #[test]
    fn device_pid_str() {
        let mut connection = initialize_connection();
        let devices = connection
            .get_device_list()
            .expect("Failed to list devices");
        let device_info = devices.first().expect("No devices plugged for tests.");
        let mut device = device_info.open().expect("Failed to open the device");
        let device_info = device.get_info().expect("Failed to get device info");
        assert_ne!("Invalid".to_string(), device_info.pid().to_string());
    }
}
