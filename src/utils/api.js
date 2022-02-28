const API_END_POINT =
  "https://zl3m4qq0l9.execute-api.ap-northeast-2.amazonaws.com/dev";

export async function request(nodeId) {
  try {
    const res = await fetch(`${API_END_POINT}/${nodeId ? nodeId : ""}`);

    if (!res.ok) {
      throw new Error("서버의 상태가 이상합니다!");
    }

    return await res.json();
  } catch (e) {
    throw new Error(`무언가 잘못 되었습니다! ${e.message}`);
  }
}

// [
//   {
//     id: "1",
//     name: "노란고양이",
//     type: "DIRECTORY",
//     filePath: null,
//     parent: null,
//   },
//   {
//     id: "3",
//     name: "까만고양이",
//     type: "DIRECTORY",
//     filePath: null,
//     parent: null,
//   },
//   {
//     id: "10",
//     name: "고등어무늬 고양이",
//     type: "DIRECTORY",
//     filePath: null,
//     parent: null,
//   },
//   {
//     id: "13",
//     name: "삼색이 고양이",
//     type: "DIRECTORY",
//     filePath: null,
//     parent: null,
//   },
//   {
//     id: "14",
//     name: "회색고양이",
//     type: "DIRECTORY",
//     filePath: null,
//     parent: null,
//   },
//   {
//     id: "20",
//     name: "하얀고양이",
//     type: "DIRECTORY",
//     filePath: "/images/20201218_002047.jpg",
//     parent: null,
//   },
// ];
