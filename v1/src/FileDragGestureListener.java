import javax.swing.tree.TreePath;
import java.awt.*;
import java.awt.datatransfer.StringSelection;
import java.awt.dnd.DragGestureEvent;
import java.awt.dnd.DragGestureListener;

public class FileDragGestureListener implements DragGestureListener {
    @Override
    public void dragGestureRecognized(DragGestureEvent dge) {
        StringSelection transferable = null;
        // 파일을 눌렀을 때 선택한 파일에 대한 경로 반환
        TreePath path = Components.getTree().getSelectionPath();

        // 선택한 것이 파일이 아닌 경우
        if (path != null) {
            transferable = new StringSelection(path.getLastPathComponent().toString());
        }
        // 선택한 것이 파일인 경우
        else if (path == null) {
            Component draggedComponent = dge.getComponent();

            // 선택한 것이 DraggablePanel인 경우
            if (draggedComponent instanceof DraggablePanel) {
                DraggablePanel draggablePanel = (DraggablePanel) draggedComponent;
                // 선택한 DraggablePanel의 id값 구하기
                String idValue = draggablePanel.getName();

                // id값을 drop 이벤트가 인식할 수 있도록 StringSelection으로 변환
                transferable = new StringSelection(idValue);
            }
        }
        // drop 이벤트에게 transferable 데이터를 보냄
        dge.startDrag(null, transferable, new FileDragSourceListener());
    }
}