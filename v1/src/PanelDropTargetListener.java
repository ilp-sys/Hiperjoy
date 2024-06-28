import javax.swing.tree.DefaultTreeModel;
import java.awt.*;
import java.awt.datatransfer.DataFlavor;
import java.awt.datatransfer.Transferable;
import java.awt.dnd.DropTargetDragEvent;
import java.awt.dnd.DropTargetDropEvent;
import java.awt.dnd.DropTargetEvent;
import java.awt.dnd.DropTargetListener;
import java.net.ConnectException;

public class PanelDropTargetListener extends Container implements DropTargetListener {
    @Override
    public void dragEnter(DropTargetDragEvent dtde) {
    }

    @Override
    public void dragOver(DropTargetDragEvent dtde) {
    }

    @Override
    public void dropActionChanged(DropTargetDragEvent dtde) {
    }

    @Override
    public void dragExit(DropTargetEvent dte) {
    }

    // drop 하는 이벤트
    @Override
    public void drop(DropTargetDropEvent dtde) {
        try {
            // drag할 때 보냈던 데이터 변환
            Transferable transferable = dtde.getTransferable();
            DataFlavor[] flavors = transferable.getTransferDataFlavors();

            if (flavors.length > 0) {

                // drag 할 때 보냈던 데이터 문자열로 변환
                Object data = transferable.getTransferData(flavors[0]);
                String name = data.toString();

                DraggablePanel draggablePanel = null; // dropSendSizeChangeXML을 사용하기 위해 필요

                // 비디오 월에 열린 DraggablePanel 중 해당 데이터를 가진 객체를 검사
                for (DraggablePanel panel : Context.getDragPanelOpenList()) {
                    if (panel.getName().equals(name)) {
                        draggablePanel = panel;
                        break;
                    }
                }

                // 파일이 open이 된 파일인지 확인
                //TODO: remove openedName
                String openedName = "";
                boolean openedResult = false;
                for (OpenFileList listObject : Context.getOpenFileList()) {
                    openedResult = listObject.id.equals(name);
                    if (openedResult) {
                        openedName = listObject.id;
                        break;
                    }
                }

                // drop 한 위치값의 x, y 좌표 가지고 오기
                Point point = dtde.getLocation();
                int pointX = (int) point.getX();
                int pointY = (int) point.getY();

                // x, y 좌표로 비디오 월의 번호 구하기
                Context.setPanelNumber(Components.getPanelNumber(pointX, pointY));

                // 비디오 월에 이미 열린 객체 인 경우
                if (openedResult && draggablePanel != null) {
                    // 객체 위치 변경
                    ApiSender.dropSendSizeChangeXML(name, Context.getPanelNumber(), draggablePanel.getRatioW(),
                            draggablePanel.getRatioH(), 0, 0);

                }
                // 비디오 월에 아직 열리지 않은 경우
                else if (!openedResult) {

                    boolean fileSearchResult = false;
                    int fileIndexSearchResult = -1;
                    // 전체 파일에서 열고 싶은 파일 찾기
                    for (int idx = 0; idx < DirTree.getControllerFileList().size(); idx++) {
                        fileSearchResult = DirTree.getControllerFileList().get(idx).contains(name);
                        if (fileSearchResult) {
                            fileIndexSearchResult = idx;
                            break;
                        }
                    }
                    // 전체 파일에 열고 싶은 파일이 있는 경우
                    if (fileSearchResult) {
                        // 파일 경로 받아오기
                        String filePath = DirTree.getControllerFileList().get(fileIndexSearchResult);
                        // 파일 열기
                        ApiSender.dropSendOpenXML(name, Context.getPanelNumber(), filePath);

                        ((DefaultTreeModel) Components.getTree().getModel()).reload();
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println(e);
        }
    }
}