import javax.swing.*;
import java.awt.*;
import java.awt.dnd.DnDConstants;
import java.awt.dnd.DragSource;
import java.awt.event.*;
import java.util.ArrayList;

public class DraggablePanel extends JPanel {
    private Point initialClick; // 드래그 시작 지점
    private JLabel label;
    boolean pressed_flag; // key event 발생 여부 확인하는 플래그

    private final int cornerSize = 10; // 조절점의 크기
    private ArrayList<Rectangle> hitBoxes = new ArrayList<>();
    private int hitBoxIndex = -1; // 선택된 조절점이 없을 때 -1
    private boolean isSelected = false; // 객체가 선택(클릭)되었는지 확인해주는 플래그
    private HitBoxPanel hitBoxPanel; // 조절점을 표시하는 패널
    private int currentWidth, currentHeight;
    private float ratioW, ratioH;
    private float originalWidth, originalHeight;
    private Image originalImage;

    public float getRatioW() {
        return ratioW;
    }

    public float getRatioH() {
        return ratioH;
    }

    public int getCurrentWidth() {
        return currentWidth;
    }

    public int getCurrentHeight() {
        return currentHeight;
    }

    public DraggablePanel(String text) {
        setLayout(new BorderLayout());

        currentWidth = 204;// 월 한 칸 크기 만큼
        currentHeight = 119; // 기본 크기
        ratioW = 1.0f;
        ratioH = 1.0f;
        originalWidth = currentWidth; // 204
        originalHeight = currentHeight; // 119

        ImageIcon imageIcon = new ImageIcon(text); // text로 이미지 경로 가져와서 imageIcon 생성
        originalImage = imageIcon.getImage(); // 불러온 원본 이미지를 변수에 저장

        // 가져올 이미지를 비디오 월 한칸의 크기로 조절
        Image scaledImage = originalImage.getScaledInstance(currentWidth, currentHeight, Image.SCALE_SMOOTH);

        ImageIcon scaledIcon = new ImageIcon(scaledImage); // 크기 조절한 이미지를 바탕으로 ImageIcon 생성
        this.label = new JLabel(scaledIcon); // label에 사진 붙여주기

        this.label.setBounds(0, 0, currentWidth, currentHeight);// 이미지아이콘을 넣은 label 크기를 월 한 칸 크기로 조절

        createHitBoxes(); // 조절점을 나타내는 hitBoxes 리스트 초기화해주기
        hitBoxPanel = new HitBoxPanel(hitBoxes); // 변수를 HitBoxPanel 객체로 초기화
        hitBoxPanel.setBounds(0, 0, currentWidth, currentHeight); // 조절점도 draggablePanel 크기(월 1칸)에 맞도록 설정

        JLayeredPane layeredPane = new JLayeredPane(); // 겹치는 JLabel, hitBoxPanel 컴포넌트를 관리해주기 위해 사용
        // 지정한 크기로 내부에 추가되는 컴포넌트들이 올바르게 표시되도록 설정
        layeredPane.setPreferredSize(new Dimension(currentWidth, currentHeight));
        layeredPane.add(this.label, Integer.valueOf(0)); // JLabel을 기본 레이어에 추가
        layeredPane.add(hitBoxPanel, Integer.valueOf(1)); // HitBoxPanel을 레이어 1에 추가

        this.add(layeredPane, BorderLayout.CENTER); // LayeredPane을 DraggablePanel의 중앙에 추가해서 레이아웃 관리

        DragSource dragSource = DragSource.getDefaultDragSource();
        dragSource.createDefaultDragGestureRecognizer(this, DnDConstants.ACTION_COPY, new FileDragGestureListener()); // 드래그 제스처 리스너를 등록해서 사용자가 드래그를 시작할 때 호출

        addMouseListener(new MouseAdapter() {

            public void mouseClicked(MouseEvent e) {
                Component c = (Component) e.getSource();
                c.setFocusable(true);
                c.requestFocus();

                if (c instanceof DraggablePanel) { // 클릭된 컴포넌트가(c) draggablePanel인지 확인하기
                    DraggablePanel addPanel = (DraggablePanel) c;
                    Context.getClickPanel().add(addPanel); // 조건이 성립하면 DraggablePanel을 clickPanel 리스트에 추가

                    initialClick = e.getPoint(); // 마우스 클릭을 시작한 초기 위치 저장

                    for (int i = 0; i < hitBoxes.size(); i++) { // hitBoxes에 저장된 모든 조절점 순회하기
                        if (hitBoxes.get(i).contains(initialClick)) { // 클릭 위치가 조절점 안에 있는지 확인하기
                            hitBoxIndex = i; // 있다면 해당 조절점의 index 저장하기
                            isSelected = true; // 조절점 클릭된 상태 변경하기
                            revalidate();// 컴포넌트 크기, 레이아웃 계산하기
                            return;
                        }
                    }
                    if (!isSelected) {
                        isSelected = true;
                        createHitBoxes(); // 조절점 생성하기
                        repaint();
                    } else if (isSelected) {
                        isSelected = false;
                        hitBoxes.clear(); // 조절점 삭제하기
                        repaint();
                    }
                }
            }

            @Override
            public void mouseReleased(MouseEvent e) {
                if (e.getComponent() instanceof DraggablePanel) { // 이벤트 발생한 컴포넌트가 DraggablePanel인지 확인하기
                    // 이벤트가 발생한 컴포넌트
                    DraggablePanel releasedPanel = (DraggablePanel) e.getComponent();
                    // 크기 조절을 끝낸 최종 컴포넌트 크기 갱신
                    releasedPanel.setSize(releasedPanel.currentWidth, releasedPanel.currentHeight);
                    // 크기 조절을 끝낸 최종 컴포넌트의 이미지 갱신
                    releasedPanel.label.setSize(releasedPanel.currentWidth, releasedPanel.currentHeight);
                    revalidate();
                    hitBoxIndex = -1;
                }
            }
        });

        addMouseMotionListener(new MouseMotionAdapter() {
            @Override
            public void mouseDragged(MouseEvent e) {

                Component component = e.getComponent();
                if (component instanceof DraggablePanel) { // 이벤트 발생한 컴포넌트가 DraggablePanel인지 확인하기
                    DraggablePanel draggedPanel = (DraggablePanel) component;

                    initialClick = e.getPoint();

                    int deltaX = e.getX() - initialClick.x; // 초기 클릭과 현재 위치의 차이를 계산하기
                    int deltaY = e.getY() - initialClick.y;

                    if (hitBoxIndex != -1 && isSelected) { // 조절점과 컴포넌트 모두 선택된 경우: 크기 조절
                        resizePanel(e.getPoint()); // 패널 크기 재설정하기
                    } else if (hitBoxIndex == -1 && isSelected) { // 조절점이 선택되지 않고 컴포넌트만 선택된 경우: 위치 이동
                        int newX = draggedPanel.getX() + deltaX;
                        int newY = draggedPanel.getY() + deltaY;
                        draggedPanel.setLocation(newX, newY); // 드래그중인 패널의 새 위치로 이동
                    }

                    for (DraggablePanel panel : Context.getDragPanelOpenList()) {
                        if (panel.getName().equals(draggedPanel.getName())) {
                            // dragPanelOpenList를 전부 순회해서 해당 패널을 찾아 속성 업데이트
                            panel.setSize(draggedPanel.getWidth(), draggedPanel.getHeight());
                            break;
                        }
                    }
                    createHitBoxes(); // 속성 업데이트를 끝내면 다시 조절점 갱신하기
                    repaint();
                }
            }
        });

        addKeyListener(new KeyListener() {

            @Override
            public void keyTyped(KeyEvent e) {
                // TODO: Auto-generated method stub

            }

            // 키보드에 대한 이벤트
            @Override
            public void keyPressed(KeyEvent e) {

                // 클릭을 하고 Delete 버튼을 눌렀을 때
                if (e.getKeyCode() == KeyEvent.VK_DELETE && isSelected) {
                    // 클릭을 한 Component를 가지고 옴
                    Component pressedComponent = e.getComponent();
                    JLayeredPane layeredPane = Components.getFrame().getLayeredPane();

                    // 그 Component가 DraggablePanel일 때
                    if (pressedComponent instanceof DraggablePanel) {
                        DraggablePanel draggablePanel = (DraggablePanel) pressedComponent;
                        // id 값 가져오기
                        String idValue = draggablePanel.getName();

                        // 열려있는 DraggablePanel 중 해당 id값을 가진 것을 찾음
                        for (DraggablePanel panel : Context.getDragPanelOpenList()) {
                            if (panel.getName().equals(idValue)) {
                                // 하이퍼월 컨트롤러에서 그 DraggablePanel 지우기
                                ApiSender.sendDeleteXML(idValue);
                                // dragPanelOpenList에서 panel 지우기
                                layeredPane.remove(pressedComponent);
                                layeredPane.repaint();
                                Context.getDragPanelOpenList().remove(panel);
                                // 클릭 초기화
                                pressed_flag = false;
                                break;
                            }
                        }
                    }
                }

                // 클릭한 후 아래 방향키를 눌렀을 때
                if (e.getKeyCode() == KeyEvent.VK_DOWN && isSelected) {

                    int lastIndex = Context.getClickPanel().size() - 1;
                    int beforePanel = 0;
                    String panelID = "";

                    DraggablePanel currentDraggablePanel = null;
                    if (!Context.getClickPanel().isEmpty()) {
                        // 클릭한 Panel 가져오기
                        currentDraggablePanel = Context.getClickPanel().get(lastIndex);
                    }

                    // 클릭한 Panel의 panelNumber과 id값을 가져오기
                    for (OpenFileList item : Context.getOpenFileList()) {
                        if (item.id.equals(currentDraggablePanel.getName())) {
                            beforePanel = item.panelNumber;
                            panelID = item.id;
                        }
                    }
                    // 비디오 월 번호가 1 이상 4 이하 일 때
                    if (1 <= beforePanel && beforePanel <= 4) {
                        // 이동 후 비디오 월 번호 계산
                        int afterPanel = beforePanel + 4;
                        // 이동에 따른 객체 change 명령 보내기
                        if (currentDraggablePanel != null) {
                            ApiSender.dropSendSizeChangeXML(panelID, afterPanel, currentDraggablePanel.ratioW, currentDraggablePanel.ratioH, 0, 0);
                        }
                        // 이동 후에 대한 통합 컨트롤러 비디오 월 좌표 구하기
                        int uiPointArray[] = Components.getUiPoint(afterPanel);

                        // UI상 객체의 좌표를 변경해 객체 이동
                        if (currentDraggablePanel != null) {
                            currentDraggablePanel.setBounds(uiPointArray[0], uiPointArray[1], currentDraggablePanel.getPreferredSize().width, currentDraggablePanel.getPreferredSize().height);
                            currentDraggablePanel.revalidate();
                        }

                    }

                }

                // 클릭한 후 위 방향키를 눌렀을 때
                if (e.getKeyCode() == KeyEvent.VK_UP && isSelected) {
                    int lastIndex = Context.getClickPanel().size() - 1;
                    int beforePanel = 0;
                    String panelID = "";

                    DraggablePanel currentDraggablePanel = null;
                    // 선택한 객체가 있을 때
                    if (!Context.getClickPanel().isEmpty()) {
                        // 선택한 마지막 객체 가지고 오기
                        currentDraggablePanel = Context.getClickPanel().get(lastIndex);
                    }
                    // 열린 파일 중 선택한 객체를 검사
                    for (OpenFileList item : Context.getOpenFileList()) {
                        if (item.id.equals(currentDraggablePanel.getName())) {
                            beforePanel = item.panelNumber;
                            panelID = item.id;
                        }
                    }
                    // 비디오 월의 번호가 5 이상 8 이하 일 때
                    if (5 <= beforePanel && beforePanel <= 8) {
                        // 이동 후 비디오 월 번호 계산
                        int afterPanel = beforePanel - 4;
                        // 이동에 따른 객체 change 명령 보내기
                        if (currentDraggablePanel != null) {
                            ApiSender.dropSendSizeChangeXML(panelID, afterPanel, currentDraggablePanel.ratioW, currentDraggablePanel.ratioH, 0, 0);
                        }
                        // 이동 후에 대한 통합 컨트롤러 비디오 월 좌표 구하기
                        int uiPointArray[] = Components.getUiPoint(afterPanel);
                        // UI상 객체의 좌표를 변경해 객체 이동
                        if (currentDraggablePanel != null) {
                            currentDraggablePanel.setBounds(uiPointArray[0], uiPointArray[1], currentDraggablePanel.getPreferredSize().width, currentDraggablePanel.getPreferredSize().height);
                            currentDraggablePanel.revalidate();
                        }
                    }
                }

                if (e.getKeyCode() == KeyEvent.VK_LEFT && isSelected) {
                    int lastIndex = Context.getClickPanel().size() - 1;
                    int beforePanel = 0;
                    String panelID = "";

                    DraggablePanel currentDraggablePanel = null;
                    // 선택한 객체가 있을 때
                    if (!Context.getClickPanel().isEmpty()) {
                        // 선택한 마지막 객체 가지고 오기
                        currentDraggablePanel = Context.getClickPanel().get(lastIndex);
                    }

                    // 열린 파일 중 선택한 객체를 검사
                    for (OpenFileList item : Context.getOpenFileList()) {
                        if (item.id.equals(currentDraggablePanel.getName())) {
                            beforePanel = item.panelNumber;
                            panelID = item.id;
                        }
                    }

                    if (2 <= beforePanel && beforePanel <= 4 || 6 <= beforePanel && beforePanel <= 8) {
                        // 이동 후 비디오 월 번호 계산
                        int afterPanel = beforePanel - 1;
                        // 이동에 따른 객체 change 명령 보내기
                        if (currentDraggablePanel != null) {
                            ApiSender.dropSendSizeChangeXML(panelID, afterPanel, currentDraggablePanel.ratioW, currentDraggablePanel.ratioH, 0, 0);
                        }
                        // 이동 후에 대한 통합 컨트롤러 비디오 월 좌표 구하기
                        int uiPointArray[] = Components.getUiPoint(afterPanel);
                        // UI상 객체의 좌표를 변경해 객체 이동
                        if (currentDraggablePanel != null) {
                            currentDraggablePanel.setBounds(uiPointArray[0], uiPointArray[1], currentDraggablePanel.getPreferredSize().width, currentDraggablePanel.getPreferredSize().height);
                            currentDraggablePanel.revalidate();
                        }
                    }
                }

                if (e.getKeyCode() == KeyEvent.VK_RIGHT && isSelected) {
                    int lastIndex = Context.getClickPanel().size() - 1;
                    int beforePanel = 0;
                    String panelID = "";

                    DraggablePanel currentDraggablePanel = null;
                    // 선택한 객체가 있을 때
                    if (!Context.getClickPanel().isEmpty()) {
                        // 선택한 마지막 객체 가지고 오기
                        currentDraggablePanel = Context.getClickPanel().get(lastIndex);
                    }

                    // 열린 파일 중 선택한 객체를 검사
                    for (OpenFileList item : Context.getOpenFileList()) {
                        if (item.id.equals(currentDraggablePanel.getName())) {
                            beforePanel = item.panelNumber;
                            panelID = item.id;
                        }
                    }

                    if (1 <= beforePanel && beforePanel <= 3 || 5 <= beforePanel && beforePanel <= 7) {
                        // 이동 후 비디오 월 번호 계산
                        int afterPanel = beforePanel + 1;
                        // 이동에 따른 객체 change 명령 보내기
                        if (currentDraggablePanel != null) {
                            ApiSender.dropSendSizeChangeXML(panelID, afterPanel, currentDraggablePanel.ratioW, currentDraggablePanel.ratioH, 0, 0);
                        }
                        // 이동 후에 대한 통합 컨트롤러 비디오 월 좌표 구하기
                        int uiPointArray[] = Components.getUiPoint(afterPanel);
                        // UI상 객체의 좌표를 변경해 객체 이동
                        if (currentDraggablePanel != null) {
                            currentDraggablePanel.setBounds(uiPointArray[0], uiPointArray[1], currentDraggablePanel.getPreferredSize().width, currentDraggablePanel.getPreferredSize().height);
                            currentDraggablePanel.revalidate();
                        }

                    }
                }
            }

            @Override
            public void keyReleased(KeyEvent e) {
                // TODO: Auto-generated method stub

            }
        });

        addMouseWheelListener(new MouseWheelListener() { // 스크롤이 움직이는 이벤트를 받으면 크기 변경이 발생

            @Override
            public void mouseWheelMoved(MouseWheelEvent e) {
                isSelected = true; // 크기조절 할 객체가 선택되면 플래그도 변경하기

                float fixedRatio = 0.1f; // 스크롤 한 번당 변경될 크기 비율
                if (e.getWheelRotation() < 0) { // 업스크롤 하는 이벤트가 발생하는 경우 = 확대 시
                    ratioW *= (1 + fixedRatio);
                    ratioH *= (1 + fixedRatio);
                } else if (e.getWheelRotation() > 0) { // 다운스크롤 하는 이벤트가 발생하는 경우 = 축소 시
                    ratioW *= (1 - fixedRatio);
                    ratioH *= (1 - fixedRatio);
                }

                updatePanelSize(); // 변경된 값을 반영하여 패널 사이즈 업데이트 해주기

                DraggablePanel c = DraggablePanel.this;
                // currentWidth와 currentHeight가 스크롤을 통해 변경될 새로운 너비와 높이(currentWidth * ratioW,
                // currentHeight * ratioH)와 어떻게 다른지를 계산하는 변수
                int subW = (int) (c.currentWidth > (c.currentWidth * ratioW) ? c.currentWidth - (c.currentWidth * ratioW) // 패널 너비가 변화된 차이를 절대값으로 계산하기
                        : (c.currentWidth * ratioW) - c.currentWidth);
                int subH = (int) (c.currentHeight > (c.currentHeight * ratioH) ? c.currentHeight - (c.currentHeight * ratioH) // 패널 높이가 변화된 차이를 절대값으로 계산하기
                        : (c.currentHeight * ratioH) - c.currentHeight);
                // subW, subH: 크기 조절된 패널의 위치와 크기를 업데이트 할 때 필요한 정보
                ApiSender.dropSendSizeChangeXML(DraggablePanel.this.getName(), Context.getPanelNumber(), ratioW, ratioH, subW, subH);
            }
        });
    }

    private void updatePanelSize() {
        int newWidth = (int) (originalWidth * ratioW);
        int newHeight = (int) (originalHeight * ratioH);

        currentWidth = newWidth; // 현재 크기를 업데이트하기
        currentHeight = newHeight;

        this.setSize(newWidth, newHeight); // draggablePanel에 현재 크기를 적용하기
        resizeImage(newWidth, newHeight);
        label.setSize(new Dimension(newWidth, newHeight)); // 이미지에 현재 크기를 적용하기
        createHitBoxes(); // 크기 조절점도 다시 갱신하기

        this.revalidate();
        this.repaint();
    }

    private void createHitBoxes() { // 조절점을 추가하는 함수
        if (!isSelected) {
            return;
        }
        int w = currentWidth;
        int h = currentHeight;
        hitBoxes.clear();

        // 모서리에 조절점 추가하기
        hitBoxes.add(new Rectangle(0, 0, cornerSize, cornerSize)); // 좌상단
        hitBoxes.add(new Rectangle(w - cornerSize, 0, cornerSize, cornerSize)); // 우상단
        hitBoxes.add(new Rectangle(0, h - cornerSize, cornerSize, cornerSize)); // 좌하단
        hitBoxes.add(new Rectangle(w - cornerSize, h - cornerSize, cornerSize, cornerSize)); // 우하단
        // 가장자리 중앙에 조절점 추가하기
        hitBoxes.add(new Rectangle(w / 2 - cornerSize / 2, 0, cornerSize, cornerSize)); // 상단 중앙
        hitBoxes.add(new Rectangle(w / 2 - cornerSize / 2, h - cornerSize, cornerSize, cornerSize)); // 하단 중앙
        hitBoxes.add(new Rectangle(0, h / 2 - cornerSize / 2, cornerSize, cornerSize)); // 왼쪽 중앙
        hitBoxes.add(new Rectangle(w - cornerSize, h / 2 - cornerSize / 2, cornerSize, cornerSize)); // 오른쪽 중앙

        if (hitBoxPanel != null) { // hitBoxPanel의 크기와 위치를 업데이트
            hitBoxPanel.setHitBoxes(hitBoxes);
            hitBoxPanel.setSize(new Dimension(w, h));
            hitBoxPanel.revalidate();
            hitBoxPanel.repaint();
        }
    }

    @Override
    protected void paintComponent(Graphics g) { // repaint 요청받을 때마다 그리기 실행
        super.paintComponent(g);
        Graphics2D g2d = (Graphics2D) g; // graphics 확장 버전의 객체로 캐스팅
        if (isSelected) {
            g2d.setColor(Color.RED);
            for (Rectangle rect : hitBoxes) {
                g2d.fill(rect); // hitBoxes에 저장된 rect 객체들을 Color.red로 칠하기
            }
        }
    }

    public void resizeImage(int width, int height) { // 이미지 크기 조절할 때마다 해상도가 안 깨지도록 원본이미지를 기준으로 크기 조절하기
        Image resizedImg = originalImage.getScaledInstance(width, height, Image.SCALE_SMOOTH);
        label.setIcon(new ImageIcon(resizedImg));
    }

    private void resizePanel(Point p) {
        int dx = p.x - initialClick.x;
        int dy = p.y - initialClick.y;
        int newWidth = getWidth();
        int newHeight = getHeight();

        // 선택된 조절점에 따라 패널 크기 조절 로직 구현하기
        if (hitBoxIndex == 0) { // 좌상단
            newWidth = getWidth() - dx;
            newHeight = getHeight() - dy;
            setBounds(getX() + dx, getY() + dy, newWidth, newHeight);
        } else if (hitBoxIndex == 1) { // 우상단
            newWidth = getWidth() + dx;
            newHeight = getHeight() - dy;
            setBounds(getX(), getY() + dy, newWidth, newHeight);
        } else if (hitBoxIndex == 2) { // 좌하단
            newWidth = getWidth() - dx;
            newHeight = getHeight() + dy;
            setBounds(getX() + dx, getY(), newWidth, newHeight);
        } else if (hitBoxIndex == 3) { // 우하단
            newWidth = getWidth() + dx;
            newHeight = getHeight() + dy;
            setBounds(getX(), getY(), newWidth, newHeight);
        } else if (hitBoxIndex == 4) { // 상단 중앙
            newHeight = getHeight() - dy;
            setBounds(getX(), getY() + dy, getWidth(), newHeight); // 변수별로 받아서 x,y
        } else if (hitBoxIndex == 5) { // 하단 중앙
            newHeight = getHeight() + dy;
            setBounds(getX(), getY(), getWidth(), newHeight);
        } else if (hitBoxIndex == 6) { // 왼쪽 중앙
            newWidth = getWidth() - dx;
            setBounds(getX() + dx, getY(), newWidth, getHeight());
        } else if (hitBoxIndex == 7) { // 오른쪽 중앙
            newWidth = getWidth() + dx;
            setBounds(getX(), getY(), newWidth, getHeight());
        }

        setBounds(getX(), getY(), newWidth, newHeight);
        label.setSize(newWidth, newHeight);
        resizeImage(newWidth, newHeight);
        currentWidth = newWidth;
        currentHeight = newHeight;

        // 변경 전 크기 대비 현재 크기의 비율 구하기
        ratioW = currentWidth / originalWidth;
        ratioH = currentHeight / originalHeight;
        createHitBoxes();
        hitBoxPanel.setBounds(0, 0, currentWidth, currentHeight);
        // 함수 호출해서 통합 컨트롤러에서 변경할 때마다 컨트롤러도 변경
        ApiSender.dropSendSizeChangeXML(this.getName(), Context.getPanelNumber(), ratioW, ratioH, 0, 0);
        revalidate();
    }
}

