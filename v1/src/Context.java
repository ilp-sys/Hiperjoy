import javax.swing.*;
import java.util.ArrayList;
import java.util.List;

public class Context {

    private static int panelNumber;
    private static List<OpenFileList> openFileList;
    private static ArrayList<DraggablePanel> clickPanel;
    private static ArrayList<DraggablePanel> dragPanelOpenList;
    private static JLayeredPane layeredPane;

    public static void setPanelNumber(int pn) {
        panelNumber = pn;
    }
    public static int getPanelNumber() {
        return panelNumber;
    }

    public static List<OpenFileList> getOpenFileList() {
        return openFileList;
    }

    public static ArrayList<DraggablePanel> getClickPanel() {
        return clickPanel;
    }

    public static ArrayList<DraggablePanel> getDragPanelOpenList() {
        return dragPanelOpenList;
    }


    public static void setLayeredPane(JLayeredPane lp) { layeredPane = lp; }
    public static JLayeredPane getLayeredPane() {
        return layeredPane;
    }
}
