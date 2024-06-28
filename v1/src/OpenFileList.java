// 열려있는 파일을 담는 배열을 만들기 위한 클래스
public class OpenFileList {
    String name;
    String id;
    int panelNumber;

    public OpenFileList(String nameStr, String idStr, int panelResult) {
        name = nameStr;
        id = idStr;
        panelNumber = panelResult;
    }
}
