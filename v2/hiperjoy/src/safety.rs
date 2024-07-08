use leap_sys::*;
use num_enum::{FromPrimitive, IntoPrimitive};
use thiserror::Error;

pub(crate) fn leap_try(leap_rs: i32) -> Result<(), Error> {
    if leap_rs == _eLeapRS_eLeapRS_Success {
        return Ok(());
    }
    Err(leap_rs.into())
}

#[derive(Debug, Clone, Copy, Eq, PartialEq, IntoPrimitive, FromPrimitive, Error)]
#[repr(i32)]
pub enum Error {
    #[error("An undetermined error has occurred.")]
    UnknownError = _eLeapRS_eLeapRS_UnknownError,
    #[error("An invalid argument was specified.")]
    InvalidArgument = _eLeapRS_eLeapRS_InvalidArgument,
    #[error(" Insufficient resources existed to complete the request.")]
    InsufficientResources = _eLeapRS_eLeapRS_InsufficientResources,
    #[error(" The specified buffer was not large enough to complete the request.")]
    InsufficientBuffer = _eLeapRS_eLeapRS_InsufficientBuffer,
    #[error("The requested operation has timed out.")]
    Timeout = _eLeapRS_eLeapRS_Timeout,
    #[error(" The operation is invalid because there is no current connection.")]
    NotConnected = _eLeapRS_eLeapRS_NotConnected,
    #[error(" The operation is invalid because the connection is not complete.")]
    HandshakeIncomplete = _eLeapRS_eLeapRS_HandshakeIncomplete,
    #[error(" The specified buffer size is too large.")]
    BufferSizeOverflow = _eLeapRS_eLeapRS_BufferSizeOverflow,
    #[error(" A communications protocol error occurred.")]
    ProtocolError = _eLeapRS_eLeapRS_ProtocolError,
    #[error(" The server incorrectly specified zero as a client ID.")]
    InvalidClientID = _eLeapRS_eLeapRS_InvalidClientID,
    #[error(" The connection to the service was unexpectedly closed while reading or writing a message.")]
    UnexpectedClosed = _eLeapRS_eLeapRS_UnexpectedClosed,
    #[error(" The specified request token does not appear to be valid")]
    UnknownImageFrameRequest = _eLeapRS_eLeapRS_UnknownImageFrameRequest,
    #[error(" The specified frame ID is not valid or is no longer valid")]
    UnknownTrackingFrameID = _eLeapRS_eLeapRS_UnknownTrackingFrameID,
    #[error(" The specified timestamp references a future point in time")]
    RoutineIsNotSeer = _eLeapRS_eLeapRS_RoutineIsNotSeer,
    #[error(" The specified timestamp references a point too far in the past")]
    TimestampTooEarly = _eLeapRS_eLeapRS_TimestampTooEarly,
    #[error(" LeapPollConnection is called concurrently.")]
    ConcurrentPoll = _eLeapRS_eLeapRS_ConcurrentPoll,
    #[error(" A connection to the Ultraleap Tracking Service could not be established.")]
    NotAvailable = _eLeapRS_eLeapRS_NotAvailable,
    #[error(" The requested operation can only be performed while the device is sending data.")]
    NotStreaming = _eLeapRS_eLeapRS_NotStreaming,
    #[error(
        " The specified device could not be opened. It is possible that the device identifier"
    )]
    CannotOpenDevice = _eLeapRS_eLeapRS_CannotOpenDevice,
    #[error(" The request is not supported by this version of the service.")]
    Unsupported = _eLeapRS_eLeapRS_Unsupported,

    /// The value is not a code. This is likely a bug or a version mixup.
    #[num_enum(default)]
    #[error(
        "The returned value is not a code. This is likely a LeapRS bug or a LeapSDK version mismatch."
    )]
    Unknown,
}

