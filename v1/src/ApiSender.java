import javax.swing.*;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;

/**
 * 1. dropSendOpenXML
 * 2. dropSendChangeXML
 * 3. sendDeleteXML
 * 4. sendVideoVolumn
 * 5. sendVideoMute
 * 6. dropSendSizeChangeXML
 **/

public class ApiSender {

    public static void dropSendOpenXML(String name, int panelNumber, String filePath) {
        try {

            boolean fileSearchResult = false;
            int fileIndexSearchResult = 0;

            // 전체 파일에서 열고자 하는 파일 찾기
            for (int idx = 0; idx < DirTree.getControllerFileList().size(); idx++) {
                fileSearchResult = DirTree.getControllerFileList().get(idx).contains(name);
                if (fileSearchResult) {
                    fileIndexSearchResult = idx;
                    break;
                }
            }
            // 앞 경로를 제외한 파일명만 구하기
            String openDir = DirTree.getControllerFileList().get(fileIndexSearchResult).replace(DirTree.getRootPath() + '\\', "");

            // 비디오 월 번호로 하이퍼월 컨트롤러 좌표 구하기
            int[] pointArray = Components.getXYPoint(panelNumber);

            // 객체 id 값 생성
            String id = Integer.toString(panelNumber);

            if (fileSearchResult) {
                // 파일을 여는 XML 생성
                String xmlString = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\" ?>";
                xmlString += "<Commands>";
                xmlString += "<command type=\"open\">";
                xmlString += "<id>" + id + "</id>";
                xmlString += "<name>" + openDir + "</name>";
                xmlString += "<x>" + pointArray[0] + "</x>";
                xmlString += "<y>" + pointArray[1] + "</y>";
                xmlString += "<boundsfill>1</boundsfill>";
                xmlString += "<boundsh>1080</boundsh>";
                xmlString += "<boundsw>1927</boundsw>";
                xmlString += "</command>";
                xmlString += "</Commands>";
                // baseURL로 통신
                URL requestURL = new URL(Components.getBaseURL() + "/xmlcommand");
                HttpURLConnection requestConnection = (HttpURLConnection) requestURL.openConnection();
                requestConnection.setRequestMethod("POST");
                requestConnection.setDoOutput(true);
                OutputStream reqStream = requestConnection.getOutputStream();
                reqStream.write(xmlString.getBytes("UTF8"));
                // 응답코드 받기
                int code = requestConnection.getResponseCode();
                // 통신 성공한 경우
                if (code == 200) {
                    System.out.println(
                            "Success to drag open " + openDir + " response : " + requestConnection.getResponseCode());

                    Context.getOpenFileList().add(new OpenFileList(name, id, panelNumber));

                    SwingUtilities.invokeLater(new Runnable() {
                        public void run() {

                            // DraggablePanel 객체 생성
                            DraggablePanel draggablePanel = new DraggablePanel(filePath);
                            // 배경 투명으로 설정
                            draggablePanel.setOpaque(false);
                            // id값 설정
                            draggablePanel.setName(id);
                            // 열린 DraggablePanel 추가
                            dragPanelOpenList.add(draggablePanel);

                            layeredPane = Components.getFrame().getLayeredPane();

                            // 비디오 월 번호로 통합 컨트롤러 좌표 구함
                            int uiPointArray[] = Components.getUiPoint(panelNumber);

                            // UI에 DraggablePanel을 좌표에 맞게 추가
                            layeredPane.add(draggablePanel, JLayeredPane.DEFAULT_LAYER);
                            draggablePanel.setBounds(uiPointArray[0], uiPointArray[1],
                                    draggablePanel.getPreferredSize().width, draggablePanel.getPreferredSize().height);
                            draggablePanel.revalidate();
                        }
                    });
                }
                // 통신에 실패한 경우
                else
                    JOptionPane.showMessageDialog(Components.getFrame(), openDir + "컨텐츠 열기에 실패하였습니다\n응답코드 : " + code, "Warning",
                            JOptionPane.INFORMATION_MESSAGE);
            }
        }
        // 예외 사항인 경우
        catch (Exception e) {
            if (e != null && e.toString().contains("Connection refused")) {
                JOptionPane.showMessageDialog(Components.getFrame(), "연결을 거부했습니다.\n" + e, "Warning", JOptionPane.INFORMATION_MESSAGE);
            } else if (e != null && e.toString().contains("Connection timed out")) {
                JOptionPane.showMessageDialog(Components.getFrame(), "연결 시간이 초과되었습니다.\n" + e, "Warning",
                        JOptionPane.INFORMATION_MESSAGE);
            } else if (e != null && e.toString().contains("Connection Exception")) {
                JOptionPane.showMessageDialog(Components.getFrame(), "연결하는데 오류가 발생했습니다\nError : " + e, "Warning",
                        JOptionPane.INFORMATION_MESSAGE);
            } else {
                JOptionPane.showMessageDialog(Components.getFrame(), "오류로 인해 컨텐츠 열기에 실패하였습니다\nError : " + e, "Warning",
                        JOptionPane.INFORMATION_MESSAGE);
            }
        }
    }


    // 비디오 월에 따라 객체의 위치를 변경하는 함수
    public static void dropSendChangeXML(String id, int panelNumber) {
        try {

            // 하이퍼월 컨트롤러 좌표 구하기
            int[] pointArray = Components.getXYPoint(panelNumber);

            // change 명령에 대한 XML
            String xmlString = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\" ?>";
            xmlString += "<Commands>";
            xmlString += "<command type=\"change\">";
            xmlString += "<id>" + id + "</id>";
            xmlString += "<x>" + pointArray[0] + "</x>";
            xmlString += "<y>" + pointArray[1] + "</y>";
            xmlString += "<boundsfill>1</boundsfill>";
            xmlString += "<boundsh>1080</boundsh>";
            xmlString += "<boundsw>1927</boundsw>";
            xmlString += "</command>";
            xmlString += "</Commands>";
            // baseURL로 통신 보내기
            URL requestURL = new URL(Components.getBaseURL() + "/xmlcommand");
            HttpURLConnection requestConnection = (HttpURLConnection) requestURL.openConnection();
            requestConnection.setRequestMethod("POST");
            requestConnection.setDoOutput(true);
            OutputStream reqStream = requestConnection.getOutputStream();
            reqStream.write(xmlString.getBytes("UTF8"));
            // 통신 성공인 경우
            if (requestConnection.getResponseCode() == 200) {
                System.out
                        .println("Success to drag change " + id + " response : " + requestConnection.getResponseCode());

                // 열린 파일 중 해당 id값을 가진 파일 찾기
                for (OpenFileList item : Context.getOpenFileList()) {
                    if (item.id.equals(id)) {
                        item.panelNumber = panelNumber;
                    }
                }

                SwingUtilities.invokeLater(new Runnable() {
                    public void run() {

                        DraggablePanel selectedPanel = null;
                        // 열린 DraggablePanel 중 해당 id를 가진 DraggablePanel 찾기
                        for (DraggablePanel panel : dragPanelOpenList) {
                            if (panel.getName().equals(id)) {
                                selectedPanel = panel;
                            }
                        }

                        // 비디오 월 번호에 따른 통합 컨트롤러 좌표 구하기
                        int uiPointArray[] = Components.getUiPoint(panelNumber);

                        // DraggablePanel 위치 변경
                        selectedPanel.setBounds(uiPointArray[0], uiPointArray[1], selectedPanel.currentWidth,
                                selectedPanel.currentHeight);
                        selectedPanel.revalidate();
                    }
                });
            }
            // 통신에 실패한 경우
            else
                JOptionPane.showMessageDialog(Components.getFrame(), "위치변경에 실패하였습니다\n응답코드 : " + requestConnection.getResponseCode(),
                        "Warning", JOptionPane.INFORMATION_MESSAGE);
        }
        // 예외가 발생한 경우
        catch (Exception e) {
            if (e != null && e.toString().contains("Connection refused")) {
                JOptionPane.showMessageDialog(Components.getFrame(), "연결을 거부했습니다.\n" + e, "Warning", JOptionPane.INFORMATION_MESSAGE);
            } else if (e != null && e.toString().contains("Connection timed out")) {
                JOptionPane.showMessageDialog(Components.getFrame(), "연결 시간이 초과되었습니다.\n" + e, "Warning",
                        JOptionPane.INFORMATION_MESSAGE);
            } else if (e != null && e.toString().contains("Connection Exception")) {
                JOptionPane.showMessageDialog(Components.getFrame(), "연결하는데 오류가 발생했습니다\nError : " + e, "Warning",
                        JOptionPane.INFORMATION_MESSAGE);
            } else {
                JOptionPane.showMessageDialog(Components.getFrame(), "오류로 인해 컨텐츠 위치변경에 실패하였습니다.\nError : " + e, "Warning",
                        JOptionPane.INFORMATION_MESSAGE);
            }
        }
    }

    public static void sendDeleteXML(String id) {
        try {
            // 삭제 명령에 대한 XML
            String xmlString = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\" ?>";
            xmlString += "<Commands>";
            xmlString += "<command type=\"close\">";
            xmlString += "<id>" + id + "</id>";
            xmlString += "</command>";
            xmlString += "</Commands>";
            // getBaseURL()로 통신 보내기
            URL requestURL = new URL(Components.getBaseURL() + "/xmlcommand");
            HttpURLConnection requestConnection = (HttpURLConnection) requestURL.openConnection();
            requestConnection.setRequestMethod("POST");
            requestConnection.setDoOutput(true);
            OutputStream reqStream = requestConnection.getOutputStream();
            reqStream.write(xmlString.getBytes("UTF8"));
            // 통신 성공 (200)인 경우
            if (requestConnection.getResponseCode() == 200) {
                System.out.println("Success to close " + id + " response : " + requestConnection.getResponseCode());
            }
            // 통신 실패 (404, 403...)인 경우
            else
                JOptionPane.showMessageDialog(Components.getFrame(), "컨텐츠 삭제에 실패하였습니다\n응답코드 : " + requestConnection.getResponseCode(),
                        "Warning", JOptionPane.INFORMATION_MESSAGE);
        }
        // 예외 사항인 경우
        catch (Exception e) {
            if (e != null && e.toString().contains("Connection refused")) {
                JOptionPane.showMessageDialog(Components.getFrame(), "연결을 거부했습니다.\n" + e, "Warning", JOptionPane.INFORMATION_MESSAGE);
            } else if (e != null && e.toString().contains("Connection timed out")) {
                JOptionPane.showMessageDialog(Components.getFrame(), "연결 시간이 초과되었습니다.\n" + e, "Warning",
                        JOptionPane.INFORMATION_MESSAGE);
            } else if (e != null && e.toString().contains("Connection Exception")) {
                JOptionPane.showMessageDialog(Components.getFrame(), "연결하는데 오류가 발생했습니다\nError : " + e, "Warning",
                        JOptionPane.INFORMATION_MESSAGE);
            } else {
                JOptionPane.showMessageDialog(Components.getFrame(), "오류로 인해 컨텐츠 삭제에 실패하였습니다\nError : " + e, "Warning",
                        JOptionPane.INFORMATION_MESSAGE);
            }
        }
    }

    public static void sendVideoVolume(String id, int volume) {
        try {
            // 볼륨 조절에 대한 XML 문자열
            String xmlString = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\" ?>";
            xmlString += "<Commands>";
            xmlString += "<command type=\"change\">";
            xmlString += "<id>" + id + "</id>";
            xmlString += "<volume>" + volume + "</volume>";
            xmlString += "</command>";
            xmlString += "</Commands>";
            // baseURL로 통신 보내기
            URL requestURL = new URL(Components.getBaseURL() + "/xmlcommand");
            HttpURLConnection requestConnection = (HttpURLConnection) requestURL.openConnection();
            requestConnection.setRequestMethod("POST");
            requestConnection.setDoOutput(true);
            OutputStream reqStream = requestConnection.getOutputStream();
            reqStream.write(xmlString.getBytes("UTF8"));
            // 통신 성공 (200)인 경우
            if (requestConnection.getResponseCode() == 200) {
                System.out.println(
                        "Success to adjust Volume" + id + " response : " + requestConnection.getResponseCode());
            }
            // 통신 실패 (404, 403...)인 경우
            else
                JOptionPane.showMessageDialog(Components.getFrame(), "소리 조절에 실패하였습니다\n응답코드: " + requestConnection.getResponseCode(),
                        "Warning", JOptionPane.INFORMATION_MESSAGE);
        }
        // 예외 사항인 경우
        catch (Exception e) {
            if (e != null && e.toString().contains("Connection refused")) {
                JOptionPane.showMessageDialog(Components.getFrame(), "연결을 거부했습니다.\n" + e, "Warning", JOptionPane.INFORMATION_MESSAGE);
            } else if (e != null && e.toString().contains("Connection timed out")) {
                JOptionPane.showMessageDialog(Components.getFrame(), "연결 시간이 초과되었습니다.\n" + e, "Warning",
                        JOptionPane.INFORMATION_MESSAGE);
            } else if (e != null && e.toString().contains("Connection Exception")) {
                JOptionPane.showMessageDialog(Components.getFrame(), "연결하는데 오류가 발생했습니다\nError : " + e, "Warning",
                        JOptionPane.INFORMATION_MESSAGE);
            } else {
                JOptionPane.showMessageDialog(Components.getFrame(), "오류로 인해 소리 조절에 실패했습니다\nError : " + e, "Warning",
                        JOptionPane.INFORMATION_MESSAGE);
            }
        }
    }
    public static void sendVideoMute(String id) {
        try {
            // 소리 끄는 명령을 보내는 XML 문자열
            String xmlString = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\" ?>";
            xmlString += "<Commands>";
            xmlString += "<command type=\"change\">";
            xmlString += "<id>" + id + "</id>";
            xmlString += "<mute>True<mute>";
            xmlString += "</command>";
            xmlString += "</Commands>";

            // baseURL로 통신 보내기
            URL requestURL = new URL(Components.getBaseURL() + "/xmlcommand");
            HttpURLConnection requestConnection = (HttpURLConnection) requestURL.openConnection();
            requestConnection.setRequestMethod("POST");
            requestConnection.setDoOutput(true);
            OutputStream reqStream = requestConnection.getOutputStream();
            reqStream.write(xmlString.getBytes("UTF8"));

            // 통신 성공 (200)인 경우
            if (requestConnection.getResponseCode() == 200) {
                System.out.println("소리 끄기 성공 / 응답코드 : " + requestConnection.getResponseCode());
            }
            // 통신 실패 (404, 403...)인 경우
            else
                JOptionPane.showMessageDialog(Components.getFrame(), "음소거에 실패하였습니다\n응답코드: " + requestConnection.getResponseCode(),
                        "Warning", JOptionPane.INFORMATION_MESSAGE);
        }
        // 예외 사항에 대한 경우
        catch (Exception e) {
            if (e != null && e.toString().contains("Connection refused")) {
                JOptionPane.showMessageDialog(Components.getFrame(), "연결을 거부했습니다.\n" + e, "Warning", JOptionPane.INFORMATION_MESSAGE);
            } else if (e != null && e.toString().contains("Connection timed out")) {
                JOptionPane.showMessageDialog(Components.getFrame(), "연결 시간이 초과되었습니다.\n" + e, "Warning",
                        JOptionPane.INFORMATION_MESSAGE);
            } else if (e != null && e.toString().contains("Connection Exception")) {
                JOptionPane.showMessageDialog(Components.getFrame(), "연결하는데 오류가 발생했습니다\nError : " + e, "Warning",
                        JOptionPane.INFORMATION_MESSAGE);
            } else {
                JOptionPane.showMessageDialog(Components.getFrame(), "오류로 인해 음소거를 하지 못했습니다\nError : " + e, "Warning",
                        JOptionPane.INFORMATION_MESSAGE);
            }
        }
    }

    // 컴포넌트의 위치나 크기가 변경되었을 경우 하이퍼월 컨트롤러에 반영하기 위한 XML 명령 보내는 함수
    public static void dropSendSizeChangeXML(String id, int panelNumber, float currentWidthRatio, float currentHeightRatio, int subW, int subH) {
        try {

            int[] pointArray = Components.getXYPoint(panelNumber); // 패널 번호에 따른 하이퍼월 컨트롤러의 좌표를 계산하기

            // 변경 값을 보낼 XML 명령 작성
            String xmlString = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\" ?>";
            xmlString += "<Commands>";
            xmlString += "<command type=\"change\">";
            xmlString += "<id>" + id + "</id>";

            // 패널 번호에 따른 변경된 위치를 하이퍼월 컨트롤러의 x,y좌표로 보내기
            if (panelNumber == 1) {
                System.out.println(currentWidthRatio);
                xmlString += "<x>" + (pointArray[0] + (pointArray[0] * (currentWidthRatio - 1) * -1 / 3)) + "</x>";
                System.out.println(xmlString);
                xmlString += "<y>" + (2 * pointArray[1] - (pointArray[1] * currentHeightRatio)) + "</y>";
            }
            if (panelNumber == 2) {
                xmlString += "<x>" + (pointArray[0] * (2 - currentWidthRatio)) + "</x>";
                xmlString += "<y>" + (2 * pointArray[1] - (pointArray[1] * currentHeightRatio)) + "</y>";
            }
            if (panelNumber == 3) {
                xmlString += "<x>" + (pointArray[0] * currentWidthRatio) + "</x>";
                xmlString += "<y>" + (2 * pointArray[1] - (pointArray[1] * currentHeightRatio)) + "</y>";
            }
            if (panelNumber == 4) {
                xmlString += "<x>" + (pointArray[0] - (pointArray[0] * (currentWidthRatio - 1) * -1 / 3)) + "</x>";
                System.out.println(xmlString);
                xmlString += "<y>" + (2 * pointArray[1] - (pointArray[1] * currentHeightRatio)) + "</y>";
            }
            if (panelNumber == 5) {
                xmlString += "<x>" + (pointArray[0] + (pointArray[0] * (currentWidthRatio - 1) * -1 / 3)) + "</x>";
                xmlString += "<y>" + ((pointArray[1] * currentHeightRatio)) + "</y>";
            }
            if (panelNumber == 6) {
                System.out.println(currentWidthRatio);
                xmlString += "<x>" + (pointArray[0] * (2 - currentWidthRatio)) + "</x>";
                System.out.println(xmlString);
                xmlString += "<y>" + ((pointArray[1] * currentHeightRatio)) + "</y>";
            }
            if (panelNumber == 7) {
                System.out.println(currentWidthRatio);
                xmlString += "<x>" + (pointArray[0] * currentWidthRatio) + "</x>";
                System.out.println(xmlString);
                xmlString += "<y>" + (pointArray[1] * currentHeightRatio) + "</y>";
            }
            if (panelNumber == 8) {
                xmlString += "<x>" + (pointArray[0] - (pointArray[0] * (currentWidthRatio - 1) * -1 / 3)) + "</x>";
                xmlString += "<y>" + ((pointArray[1] * currentHeightRatio)) + "</y>";
            }

            xmlString += "<boundsfill>1</boundsfill>";
            xmlString += "<boundsh>" + (1080 * currentHeightRatio) + "</boundsh>"; // ratio값을 이용해 변경된 너비, 높이값을 하이퍼월
            // 컨트롤러로 보내기
            xmlString += "<boundsw>" + (1927 * currentWidthRatio) + "</boundsw>";
            xmlString += "</command>";
            xmlString += "</Commands>";

            URL requestURL = new URL(Components.getBaseURL() + "/xmlcommand");
            HttpURLConnection requestConnection = (HttpURLConnection) requestURL.openConnection();
            requestConnection.setRequestMethod("POST");
            requestConnection.setDoOutput(true);
            OutputStream reqStream = requestConnection.getOutputStream();
            reqStream.write(xmlString.getBytes("UTF8"));

            if (requestConnection.getResponseCode() == 200) { // http 요청이 성공적으로 수행된 경우
                for (OpenFileList item : Context.getOpenFileList()) {
                    if (item.id.equals(id)) {
                        item.panelNumber = panelNumber; // 모든 openFileList를 순회했을 때 오픈된 파일의 id가 item의 id가 일치하는 컨텐츠가
                        // 새로운 패널로 옮겨짐
                    }
                }

                SwingUtilities.invokeLater(new Runnable() { // Swing 컴포넌트의 상태를 변경하는 경우 SwingUtilities.invokeLater 사용
                    public void run() {

                        DraggablePanel selectedPanel = null;
                        for (DraggablePanel panel : dragPanelOpenList) {
                            if (panel.getName().equals(id)) { // 모든 dragPanelOpenList를 순회했을 때 해당 리스트와 id가 일치하는 패널을
                                // 찾는 경우
                                selectedPanel = panel; // selectedPanel을 panel로 갱신
                            }
                        }

                        int uiPointArray[] = Components.getUiPoint(panelNumber); // panelNumber에 해당하는 통합 컨트롤러의 UI 좌표 계산하기

                        // 선택된 패널의 위치와 크기 설정
                        selectedPanel.setBounds(uiPointArray[0], uiPointArray[1], (int) (selectedPanel.getPreferredSize().width * currentWidthRatio), (int) (selectedPanel.getPreferredSize().height * currentHeightRatio));
                        selectedPanel.revalidate();
                    }
                });
            } else
                System.out.println("Failed to drag change " + id + " response: " + requestConnection.getResponseCode());
        } catch (Exception e) {
            System.out.println("Failed to drag open error: " + e);
        }
    }
}
