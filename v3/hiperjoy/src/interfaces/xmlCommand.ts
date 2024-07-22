interface OpenCommand {
  type: "open";
  name: string;
  id: string;
}

interface ChangeCommand {
  type: "change";
  id: string;
}

interface CloseCommand {
  type: "close";
  id: string;
}

interface PreviewCommand {
  type: "preview";
  name: string;
}

interface EnvironmentAction {
  type: "environment";
  name: string;
  zone: string | null;
}

interface WallsAction {
  type: "walls";
}

interface ListAction {
  action: "list";
  filter: String;
}

interface MuteAllAction {
  type: "mute-all";
}

interface UnMuteAllAction {
  type: "unmute-all";
}

interface ScheduleAction {
  type: "scheduler";
}

export type Command =
  | OpenCommand
  | ChangeCommand
  | CloseCommand
  | PreviewCommand
  | EnvironmentAction;

export type Action =
  | WallsAction
  | ListAction
  | MuteAllAction
  | UnMuteAllAction
  | ScheduleAction;