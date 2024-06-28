import java.awt.*;
import java.awt.dnd.*;
import java.awt.event.*;

import javax.swing.*;
import javax.swing.event.ChangeEvent;
import javax.swing.event.ChangeListener;
import javax.swing.tree.DefaultMutableTreeNode;
import javax.swing.tree.TreePath;

public class Components extends JFrame {

    private static JTree tree;

    private DirTree dirTree = DirTree.getInstance();
    private JTextField ipTextField, portTextField, contentsTextField;
    public String ip = "127.0.0.1";
    public String port = "8000";

    private static JFrame frame;
    private static JFrame inputFrame;
    @SuppressWarnings("exports")
    private JPanel bottomPanel;
    @SuppressWarnings("exports")
    public JScrollPane treeScrollPane;
    private JPanel rightPanel;
    private static String baseURL = "";

    private JPanel[] dropPanels = new JPanel[8];
    private GridBagConstraints gbc;



    public Components() {
        // IP, PORT, Contents 경로를 입력할 수 있는 Frame과 Panel 만들기
        inputFrame = new JFrame("IP/PORT/CONTENTS 입력창");
        inputFrame.setSize(500, 300);
        inputFrame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        inputFrame.setLocationRelativeTo(null);

        JPanel mainPanel = new JPanel(new BorderLayout());
        mainPanel.setBorder(BorderFactory.createEmptyBorder(20, 20, 20, 20));

        JPanel centerPanel = new JPanel(new GridBagLayout());
        GridBagConstraints gbc = new GridBagConstraints();

        // "IP : " 라벨 생성 및 위치 지정
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.insets = new Insets(0, 0, 10, 10);
        centerPanel.add(new JLabel("IP :"), gbc);
        // IP 입력할 수 있는 텍스트 필드 생성
        gbc.gridx = 1;
        gbc.gridy = 0;
        gbc.insets = new Insets(0, 0, 10, 10);
        ipTextField = new JTextField();
        ipTextField.setPreferredSize(new Dimension(200, 25));
        centerPanel.add(ipTextField, gbc);
        // "PORT : " 라벨 생성 및 위치 지정
        gbc.gridx = 0;
        gbc.gridy = 1;
        gbc.insets = new Insets(0, 0, 10, 10);
        centerPanel.add(new JLabel("PORT :"), gbc);
        // PORT 입력할 수 있는 텍스트 필드 생성
        gbc.gridx = 1;
        gbc.gridy = 1;
        gbc.insets = new Insets(0, 0, 10, 10);
        portTextField = new JTextField();
        portTextField.setPreferredSize(new Dimension(200, 25));
        centerPanel.add(portTextField, gbc);
        // "CONTENTS : " 라벨 생성 및 위치 지정
        gbc.gridx = 0;
        gbc.gridy = 2;
        gbc.insets = new Insets(0, 0, 10, 10);
        centerPanel.add(new JLabel("CONTENTS :"), gbc);
        // CONTENTS 입력할 수 있는 텍스트 필드 생성
        gbc.gridx = 1;
        gbc.gridy = 2;
        gbc.insets = new Insets(0, 0, 10, 10);
        contentsTextField = new JTextField();
        contentsTextField.setPreferredSize(new Dimension(200, 25));
        centerPanel.add(contentsTextField, gbc);
        // 확인 버튼 생성
        gbc.gridx = 0;
        gbc.gridy = 3;
        gbc.gridwidth = 2;
        gbc.insets = new Insets(10, 0, 0, 0);
        JButton confirmButton = new JButton("확인");
        // 확인 버튼 이벤트 처리
        confirmButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                String ipAddress = ipTextField.getText();
                String portAddress = portTextField.getText();
                String contentsDirectory = contentsTextField.getText();
                // 입력되지 않았을 때 기본값 설정
                if (ipAddress.equals("")) {
                    ipAddress = ip;
                }
                if (portAddress.equals("")) {
                    portAddress = port;
                }
                if (contentsDirectory.equals("")) {
                    contentsDirectory = dirTree.getRootPath();
                }
                // 사용자가 입력한 정보들을 확인할 수 있는 창 만들기
                Boolean result = onConfirmButtonClick(ipAddress, portAddress, contentsDirectory);
                if (result) {
                    ip = ipAddress;
                    port = portAddress;
                    dirTree.setRootPath(contentsDirectory);

                    // IP, PORT를 가지고 baseURL 생성
                    String url = makeURL();
                    new Components(url, dirTree.getRootPath());
                    inputFrame.dispose();
                }

            }
        });

        centerPanel.add(confirmButton, gbc);
        mainPanel.add(centerPanel, BorderLayout.CENTER);
        inputFrame.add(mainPanel);

        inputFrame.setVisible(true);
    }

    public Components(String url, String root) {
        // 컨트롤러 Frame 생성
        frame = new JFrame("Control System Interface");
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setSize(1150, 800);

        // CONTENTS 경로 폴더와 파일을 Tree로 변환 후 JTree 객체 생성
        dirTree.setRootPath(root);
        tree = new JTree(dirTree.getFile(dirTree.getRootPath()));
        tree.setRootVisible(false);

        // tree를 드래그 소스로 지정
        DragSource dragSource = DragSource.getDefaultDragSource();
        dragSource.createDefaultDragGestureRecognizer(tree, DnDConstants.ACTION_COPY, new FileDragGestureListener());

        // tree에 대한 마우스 이벤트
        tree.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseClicked(MouseEvent e) {
                if (e.getClickCount() == 2) {
                    TreePath path = tree.getSelectionPath();
                    DefaultMutableTreeNode selectedNode = (DefaultMutableTreeNode) path.getLastPathComponent();

                    for (String item : dirTree.getFolderNameList()) {
                        if (item.equals(selectedNode.toString())) {
                            break;
                        }
                    }
                }
            }
        });

        // 지우기 버튼 생성 후 버튼 이벤트 처리
        JButton deleteButton = new JButton("지우기");
        deleteButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {

                // 마지막으로 클릭한 객체 가져오기
                int lastIndex = Context.getClickPanel().size() - 1;
                DraggablePanel getPanel = Context.getClickPanel().get(lastIndex);

                // 오픈된 객체 중 클릭한 객체가 있는지 확인 후 삭제
                int selectedIndex = -1;
                if (Context.getOpenFileList().size() != 0) {
                    for (int idx = 0; idx < Context.getOpenFileList().size(); idx++) {
                        if (Context.getOpenFileList().get(idx).id.equals(getPanel.getName())) {
                            selectedIndex = idx;
                            ApiSender.sendDeleteXML(Context.getOpenFileList().get(idx).id);
                        }
                    }
                }
                // 오픈된 객체 저장하는 배열에서 삭제한 객체 삭제
                Context.getOpenFileList().remove(selectedIndex);

                // 삭제된 객체의 DraggablePanel이 있는 LayeredPane 가져오기
                JLayeredPane layeredPane2 = frame.getLayeredPane();

                // 삭제할 객체를 찾아서 LayeredPane에서 삭제
                for (int idx = 0; idx < Context.getDragPanelOpenList().size(); idx++) {
                    if (Context.getDragPanelOpenList().get(idx).getName().equals(getPanel.getName())) {
                        selectedIndex = idx;
                        layeredPane2.remove(Context.getDragPanelOpenList().get(idx));
                        layeredPane2.repaint();
                        break;
                    }
                }
                // 삭제한 객체 배열에서도 삭제
                Context.getDragPanelOpenList().remove(selectedIndex);
            }
        });

        // 전체 지우기 버튼 생성 후 버튼 이벤트 처리
        JButton deleteAllButton = new JButton("전체 지우기");
        deleteAllButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {

                // 삭제할 객체들의 DraggablePanel이 있는 LayeredPane 가져오기
                JLayeredPane layeredPane2 = frame.getLayeredPane();

                // 오픈되어 있는 모든 객체들을 LayeredPane에서 삭제하기
                for (DraggablePanel panel : Context.getDragPanelOpenList()) {
                    layeredPane2.remove(panel);
                    layeredPane2.repaint();
                }

                // 오픈되어 있는 모든 객체들을 하이퍼월 컨트롤러에게 삭제 명령 내리기
                if (Context.getOpenFileList().size() != 0) {
                    for (OpenFileList item : Context.getOpenFileList()) {
                        ApiSender.sendDeleteXML(item.id);
                    }
                }
                Context.getLayeredPane().repaint();

                // 배열 요소 전체 삭제
                Context.getOpenFileList().clear();
                Context.getDragPanelOpenList().clear();
            }
        });

        // 소리 끄기 버튼 생성 후 버튼 이벤트 처리
        JButton muteButton = new JButton("소리 끄기");
        muteButton.addActionListener(new ActionListener() {

            @Override
            public void actionPerformed(ActionEvent e) {

                // 마지막으로 클릭한 객체를 가지고 온다
                int lastIndex = Context.getClickPanel().size() - 1;
                DraggablePanel getPanel = Context.getClickPanel().get(lastIndex);

                // 클릭한 객체가 열려있는지 확인 후 동영상일 경우 Mute 명령 보내기
                for (OpenFileList item : Context.getOpenFileList()) {
                    if (item.id.equals(getPanel.getName()) && item.name.endsWith(".hwv")) {
                        ApiSender.sendVideoMute(item.id);
                        break;
                    }
                }
            }
        });

        // 전체 소리 끄기 버튼 생성 후 버튼 이벤트 처리
        JButton muteAllButton = new JButton("전체 소리 끄기");
        muteAllButton.addActionListener(new ActionListener() {

            @Override
            public void actionPerformed(ActionEvent e) {
                // 현재 오픈되어 있는 객체 중에 모든 동영상 객체에 Mute 명령 보내기
                if (Context.getOpenFileList().size() != 0) {
                    for (OpenFileList item : Context.getOpenFileList()) {
                        if (item.name.endsWith(".hwv")) {
                            ApiSender.sendVideoMute(item.id);
                        }
                    }
                }
            }
        });

        // 소리바 생성
        JSlider volumeSlider = new JSlider(JSlider.HORIZONTAL, 0, 100, 50);
        volumeSlider.setBorder(BorderFactory.createEmptyBorder(10, 10, 10, 10));
        volumeSlider.setMajorTickSpacing(20);
        volumeSlider.setMinorTickSpacing(20);
        volumeSlider.setPaintTicks(true);
        volumeSlider.setPaintLabels(true);

        // 소리바에 대한 이벤트 처리
        volumeSlider.addChangeListener(new ChangeListener() {
            @Override
            public void stateChanged(ChangeEvent e) {
                // 소리 볼륨값 가져오기
                int volume = volumeSlider.getValue();

                // 오픈된 객체 중 모든 동영상 객체의 볼륨을 조절
                if (Context.getOpenFileList().size() != 0) {
                    for (OpenFileList item : Context.getOpenFileList()) {
                        if (item.name.endsWith(".hwv")) {
                            ApiSender.sendVideoVolume(item.id, volume);
                        }
                    }
                }
            }

        });

        // 프로그램 종료 버튼 생성과 버튼에 대한 이벤트 처리
        JButton exitButton = new JButton("프로그램 종료");
        exitButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                frame.dispose();
            }
        });

        // 컨트롤러 왼쪽 위 패널 생성
        JPanel topPanel = new JPanel();
        topPanel.setBorder(BorderFactory.createEmptyBorder(15, 10, 15, 10));

        // 지우기, 전체 지우기, 소리 끄기, 전체 소리 끄기, 소리바, 프로그램 종료 버튼 추가
        topPanel.add(deleteButton, BorderLayout.CENTER);
        topPanel.add(deleteAllButton, BorderLayout.CENTER);
        topPanel.add(muteButton, BorderLayout.CENTER);
        topPanel.add(muteAllButton, BorderLayout.CENTER);
        topPanel.add(volumeSlider, BorderLayout.CENTER);
        topPanel.add(exitButton, BorderLayout.CENTER);

        setLocationRelativeTo(null);

        // 왼쪽 아래 패널 생성
        bottomPanel = new JPanel(new BorderLayout());

        // 폴더, 파일 트리를 넣을 수 있는 ScrollPane 생성
        treeScrollPane = new JScrollPane(tree);
        // ScrollPane 왼쪽 아래 패널에 추가
        bottomPanel.add(treeScrollPane, BorderLayout.CENTER);

        // 수직으로 분할
        JSplitPane leftSplitPane = new JSplitPane(JSplitPane.VERTICAL_SPLIT, topPanel, bottomPanel);
        leftSplitPane.setDividerLocation(200);

        // 오른쪽 패널을 생성합니다
        rightPanel = createRightPanel();
        // 오른쪽 패널에 Drop 할 수 있도록 설정
        new DropTarget(rightPanel, new PanelDropTargetListener());

        // 수평으로 분할
        JSplitPane mainSplitPane = new JSplitPane(JSplitPane.HORIZONTAL_SPLIT, leftSplitPane, rightPanel);
        mainSplitPane.setDividerLocation(250);

        frame.getContentPane().add(mainSplitPane);
        frame.setVisible(true);
    }

    private Boolean onConfirmButtonClick(String ipAddress, String portAddress, String contentsAddress) {
        // 사용자가 입력한 정보를 확인 할 수 있는 창
        int result = JOptionPane.showConfirmDialog(null, "입력된 IP: " + ipAddress + "\n입력된 PORT: " + portAddress
                        + "\nCONTENTS 경로: " + contentsAddress + "\n\n입력한 정보가 맞으면 확인을 눌러주세요", "확인",
                JOptionPane.OK_CANCEL_OPTION);

        // 사용자가 확인 버튼을 눌렀을 때 true 반환
        if (result == JOptionPane.OK_OPTION) {
            return true;
        }
        // 사용자가 취소 버튼을 눌렀을 때 false 반환
        return false;
    }

    private String makeURL() {
        // ip와 port를 가지고 통신을 보낼 URL 생성
        baseURL = "http://" + ip + ":" + port;
        return baseURL;
    }

    private JPanel createRightPanel() {
        JPanel rightPanel = new JPanel(new GridBagLayout());
        gbc = new GridBagConstraints();
        gbc.gridwidth = 1;
        gbc.gridheight = 1;
        gbc.gridx = gbc.gridy = 0;
        gbc.ipadx = 192; // 컴포넌트의 가로 크기에 20 픽셀을 추가
        gbc.ipady = 108; // 컴포넌트의 세로 크기에 20 픽셀을 추가

        gbc.fill = GridBagConstraints.BOTH;

        for (int i = 0; i < 8; i++) {
            dropPanels[i] = new JPanel();
            dropPanels[i].setBorder(BorderFactory.createLineBorder(Color.black));
            dropPanels[i].setBackground(i % 2 == 0 ? Color.DARK_GRAY : Color.LIGHT_GRAY);
            // 각 패널의 위치 설정
            gbc.gridx = i % 4; // 열 위치
            gbc.gridy = i / 4; // 행 위치
            rightPanel.add(dropPanels[i], gbc);
        }

        return rightPanel;
    }

    // 마우스 X, Y 좌표로 비디오 월 번호 반환
    public static int getPanelNumber(int x, int y) {
        if (29 <= x && x <= 230) {
            if (262 <= y && y <= 381) {
                return 1;
            } else if (382 <= y && y <= 500) {
                return 5;
            }
        } else if (230 <= x && x <= 431) {
            if (262 <= y && y <= 381) {
                return 2;
            } else if (382 <= y && y <= 500) {
                return 6;
            }
        } else if (431 <= x && x <= 632) {
            if (262 <= y && y <= 381) {
                return 3;
            } else if (382 <= y && y <= 500) {
                return 7;
            }
        } else if (632 <= x && x <= 833) {
            if (262 <= y && y <= 381) {
                return 4;
            } else if (382 <= y && y <= 500) {
                return 8;
            }
        }
        return 0;
    }

    // 비디오 월 번호로 통합 컨트롤러 좌표를 구함
    public static int[] getUiPoint(int panelNumber) {
        // 초기화
        int[] result = {0, 0};

        // 비디오 월 번호에 따른 좌표를 result에 저장
        if (1 <= panelNumber && panelNumber <= 4) {
            result[0] = 290 + 204 * (panelNumber - 1);
            result[1] = 262;
        } else if (5 <= panelNumber && panelNumber <= 8) {
            result[0] = 290 + 204 * (panelNumber - 5);
            result[1] = 381;
        }
        // 좌표 반환
        return result;

    }

    // 비디오 월 번호에 따른 하이퍼월 컨트롤러 좌표 반환
    public static int[] getXYPoint(int panelNumber) {
        // 초기화
        int[] result = {0, 0};
        // 비디오 월 번호에 따른 좌표 result 배열에 추가
        if (panelNumber == 1) {
            result[0] = -2880;
            result[1] = 540;
        } else if (panelNumber == 2) {
            result[0] = -960;
            result[1] = 540;
        } else if (panelNumber == 3) {
            result[0] = 960;
            result[1] = 540;
        } else if (panelNumber == 4) {
            result[0] = 2880;
            result[1] = 540;
        } else if (panelNumber == 5) {
            result[0] = -2880;
            result[1] = -540;
        } else if (panelNumber == 6) {
            result[0] = -960;
            result[1] = -540;
        } else if (panelNumber == 7) {
            result[0] = 960;
            result[1] = -540;
        } else if (panelNumber == 8) {
            result[0] = 2880;
            result[1] = -540;
        }
        // 좌표 반환
        return result;
    }

    public static JTree getTree() {
        return tree;
    }

    public static JFrame getFrame() {
        return frame;
    }

    public static String getBaseURL() { return baseURL; }

}