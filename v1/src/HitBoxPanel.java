import javax.swing.*;
import java.awt.*;
import java.util.ArrayList;

class HitBoxPanel extends JPanel {
    private ArrayList<Rectangle> hitBoxes;

    public HitBoxPanel(ArrayList<Rectangle> hitBoxes) {
        this.hitBoxes = new ArrayList<>(hitBoxes); // HitBoxPanel이 생성 시 호출되어 인수 hitBoxes 리스트로 클래스 멤버변수 초기화
        setOpaque(false);
    }

    public void setHitBoxes(ArrayList<Rectangle> hitBoxes) {
        this.hitBoxes = hitBoxes; // 새로운 hitBoxes 리스트로 멤버 변수 업데이트
        repaint(); // 호출되면 paintComponent로 새로운 hitBoxes로 다시 그리기
    }

    @Override
    protected void paintComponent(Graphics g) {
        super.paintComponent(g);
        Graphics2D g2d = (Graphics2D) g; // 더 세밀한 설정을 위해 Graphics 객체를 Graphics2D로 캐스팅
        g2d.setColor(Color.RED);
        for (Rectangle rect : hitBoxes) {
            g2d.fill(rect); // 모든 hitBoxes 순회해서 Rectangle 빨간색으로 채우기
        }
    }
}