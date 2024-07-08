use ::leap_sys::*;
use bitflags::bitflags;
use std::mem;
use core::marker::PhantomData;

use crate::connection_message::ConnectionMessage;
use crate::safety::{leap_try, Error};
use crate::connection_info::ConnectionInfo;

bitflags! {
    pub struct ConnectionConfigFlags: _eLeapConnectionConfig {
        const MULTI_DEVICE_AWARE = _eLeapConnectionConfig_eLeapConnectionConfig_MultiDeviceAware;
    }
}

pub struct ConnectionConfig {
    pub(crate) handle: LEAP_CONNECTION_CONFIG,
}

impl Default for ConnectionConfig {
    fn default() -> Self {
        Self::new(ConnectionConfigFlags::empty())
    }
}

impl ConnectionConfig {
    pub fn new(flags: ConnectionConfigFlags) -> Self {
        let config = ConnectionConfig {
            handle: LEAP_CONNECTION_CONFIG {
                size: std::mem::size_of::<LEAP_CONNECTION_CONFIG>() as u32,
                flags: flags.bits() as u32,
                server_namespace: std::ptr::null(),
            },
        };
        config
    }
}

pub struct Connection {
    handle: LEAP_CONNECTION,
}

impl Drop for Connection {
    fn drop(&mut self) {
        unsafe {
            LeapCloseConnection(self.handle);
            LeapDestroyConnection(self.handle);
        }
    }
}

impl Connection {
    pub fn create(config: ConnectionConfig) -> Result<Self, Error> {
        let mut leap_connection: LEAP_CONNECTION;
        unsafe {
            leap_connection = mem::zeroed();
            leap_try(LeapCreateConnection(&config.handle, &mut leap_connection))?;
        }

        Ok(Self {
            handle: leap_connection,
        })
    }

    pub fn open(&mut self) -> Result<(), Error> {
        unsafe {
            leap_try(LeapOpenConnection(self.handle))?;
        }

        Ok(())
    }

    pub fn info(&mut self) -> Result<ConnectionInfo, Error> {
        let mut info = LEAP_CONNECTION_INFO {
            size: std::mem::size_of::<LEAP_CONNECTION_INFO>() as u32,
            status: 0,
        };
        unsafe {
            leap_try(LeapGetConnectionInfo(self.handle, &mut info))?;
        }

        Ok(ConnectionInfo(info))
    }

    pub fn poll(&mut self, timeout: u32) -> Result<ConnectionMessage, Error> {
        let mut msg: LEAP_CONNECTION_MESSAGE;
        unsafe {
            msg = mem::zeroed();
            leap_try(LeapPollConnection(self.handle, timeout, &mut msg))?;
        }
        Ok(ConnectionMessage(msg, PhantomData))
    }
}
