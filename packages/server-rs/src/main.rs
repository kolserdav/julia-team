#[macro_use]
extern crate log;
pub mod ws;
use chat::Chat;
use std::{
    net::TcpStream,
    sync::{Arc, Mutex},
};
use uuid::Uuid;
use ws::{
    messages::{Any, MessageType},
    WSCallbackSelf, WSCallbackSocket, WS,
};
mod locales;

use tungstenite::Message;
mod rtc;
use rtc::RTC;

mod chat;
pub mod common;

use crate::ws::messages::{GetChatUnit, GetLocale, GetRoom, GetUserId, Offer};

fn main() {
    env_logger::builder().format_timestamp(None).init();

    let rtc = RTC::new();

    let chat = Chat::new();

    let ws = WS::new(Arc::new(rtc), Arc::new(chat));

    ws.listen_ws("127.0.0.1:3001", handle_mess);
}

fn handle_mess(
    ws: WSCallbackSelf,
    msg: Message,
    conn_id: Uuid,
    socket: WSCallbackSocket,
) -> Result<(), ()> {
    let msg_c = msg.clone();
    let json = ws.parse_message::<Any>(msg);
    if let Err(e) = json {
        error!("Error handle WS: {:?}", e);
        return Ok(());
    }
    let json = json.unwrap();
    let type_mess = &json.r#type;

    debug!("Get message: {}", json);

    match type_mess {
        MessageType::GET_LOCALE => {
            let msg = ws.parse_message::<GetLocale>(msg_c).unwrap();
            ws.get_locale(msg, conn_id, socket);
        }
        MessageType::GET_USER_ID => {
            let msg = ws.parse_message::<GetUserId>(msg_c).unwrap();
            ws.get_user_id(msg, conn_id, socket);
        }
        MessageType::GET_ROOM => {
            let msg = ws.parse_message::<GetRoom>(msg_c).unwrap();
            ws.get_room(msg);
        }
        MessageType::GET_CHAT_UNIT => {
            let msg = ws.parse_message::<GetChatUnit>(msg_c).unwrap();
            ws.get_chat_unit(msg, conn_id, socket);
        }
        MessageType::OFFER => {
            let msg = ws.parse_message::<Offer>(msg_c).unwrap();
            ws.offer(msg);
        }
        _ => {
            warn!("Default case of message: {:?}", json);
        }
    };

    Ok(())
}
