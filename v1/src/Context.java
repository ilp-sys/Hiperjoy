import java.util.ArrayList;
import java.util.List;

public class Context {

    private static List<OpenFileList> openFileList;
    private static ArrayList<DraggablePanel> clickPanel;

    public static List<OpenFileList> getOpenFileList() {
        return openFileList;
    }

    public static ArrayList<DraggablePanel> getClickPanel() {
        return clickPanel;
    }

}
