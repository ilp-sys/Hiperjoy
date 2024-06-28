import java.awt.*;
import java.awt.dnd.DragSourceDragEvent;
import java.awt.dnd.DragSourceDropEvent;
import java.awt.dnd.DragSourceEvent;
import java.awt.dnd.DragSourceListener;

public class FileDragSourceListener implements DragSourceListener {
    @Override
    public void dragEnter(DragSourceDragEvent dsde) {
    }

    @Override
    public void dragOver(DragSourceDragEvent dsde) {

        // 드래그를 한 객체를 불러오기
        Component draggedComponent = dsde.getDragSourceContext().getComponent();
        DraggablePanel selectPanel = null;

        // 드래그를 한 객체가 DraggablePanel인 경우
        if (draggedComponent instanceof DraggablePanel) {
            DraggablePanel draggablePanel = (DraggablePanel) draggedComponent;

            // DraggablePanel의 id 값을 구함
            String idValue = draggablePanel.getName();

            // 비디오 월에 열린 DraggablePanel 중에 그 id를 가진 객체가 있는지 확인
            for (DraggablePanel panel : Context.getDragPanelOpenList()) {
                if (panel.getName().equals(idValue)) {
                    selectPanel = panel;
                    break;
                }
            }
        }
        // 검사 후 일치한 객체가 있는 경우
        if (selectPanel != null) {
            // 화면의 좌표를 가지고 옴
            Point locationOnScreen = Components.getFrame().getLocationOnScreen();
            // 화면의 좌표 중 x, y 값을 가지고 옴
            int x = (int) locationOnScreen.getX();
            int y = (int) locationOnScreen.getY();
            // 화면에 일치한 객체를 각 좌표에 맞게 띄움
            selectPanel.setBounds(dsde.getX() - x - 100, dsde.getY() - y - 100, selectPanel.getCurrentWidth(),
                    selectPanel.getCurrentHeight());
        }
    }

    @Override
    public void dropActionChanged(DragSourceDragEvent dsde) {
    }

    @Override
    public void dragExit(DragSourceEvent dse) {
    }

    @Override
    public void dragDropEnd(DragSourceDropEvent dsde) {
    }
}