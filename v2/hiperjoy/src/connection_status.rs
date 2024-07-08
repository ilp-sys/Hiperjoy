use leap_sys::*;
use num_enum::{FromPrimitive, IntoPrimitive};

#[derive(Debug, Clone, Copy, Eq, PartialEq, IntoPrimitive, FromPrimitive)]
#[repr(i32)]
pub enum ConnectionStatus {
    NotConnected = _eLeapConnectionStatus_eLeapConnectionStatus_NotConnected,
    Connected = _eLeapConnectionStatus_eLeapConnectionStatus_Connected,
    HandshakeIncomplete = _eLeapConnectionStatus_eLeapConnectionStatus_HandshakeIncomplete,
    NotRunning = _eLeapConnectionStatus_eLeapConnectionStatus_NotRunning,
    #[num_enum(default)]
    Unknown,
}

