import javax.swing.tree.DefaultMutableTreeNode;
import java.io.File;
import java.util.ArrayList;

public class DirTree {
    private static DirTree instance = new DirTree();
    private static ArrayList<String> controllerFileList;
    private static ArrayList<String> folderNameList;
    private static String rootPath = "C:\\Users\\Public\\Hiperwall\\contents";

    //TODO: consider it to be not singleton class
    private DirTree() {}

    public static DirTree getInstance() {
        return instance;
    }

    public DefaultMutableTreeNode getFile(String path) {
        File file = new File(path);
        DefaultMutableTreeNode root = new DefaultMutableTreeNode(file.getName());

        if (file.isDirectory()) {
            // file 경로 안 파일들을 불러옴
            File[] files = file.listFiles();

            if (files.length == 0) {
                root.add(new DefaultMutableTreeNode(file.getName()));
            }
            if (files != null) {
                for (File child : files) {

                    // 특정 확장자를 제외하고 root 트리에 추가
                    if (!child.toString().endsWith(".hwc") && !child.toString().endsWith(".hws")
                            && !child.toString().endsWith(".hwtxt") && !child.toString().contains("HiperwallAnimations")
                            && !child.toString().contains("hiperwall_thumbs")
                            && !child.toString().contains("schedules")) {
                        root.add(getFile(child.getAbsolutePath()));

                        // 만약 .이 포함된 파일이라면 controllerFileList에 추가
                        if (child.toString().contains(".")) {
                            controllerFileList.add(child.toString());

                            // 만약 .이 포함되지 않고 .으로 끝나지 않는 폴더라면 folderNameList에 추가
                        } else if (!child.toString().endsWith(".")) {
                            String folderName = child.toString().replace(rootPath + "\\", "");
                            folderNameList.add(folderName);
                        }
                    }
                }
            }
        }
        return root;
    }

    public static ArrayList<String> getControllerFileList() {
        return controllerFileList;
    }

    public static ArrayList<String> getFolderNameList() {
        return folderNameList;
    }

    public void setRootPath(String rootPath) { this.rootPath = rootPath; }
    public static String getRootPath() { return rootPath; }
}
