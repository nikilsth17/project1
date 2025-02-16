// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   generalPages: [],
//   documentContent: {},
//   loading: false,
//   error: null,
// };

// const generalPagesSlice = createSlice({
//   name: "generalPages",
//   initialState,
//   reducers: {
//     fetchGeneralPagesRequest: (state) => {
//       state.loading = true;
//       state.error = null;
//     },
//     fetchGeneralPageRequestSuccess: (state, action) => {
//       state.loading = false;
//       state.generalPages = action.payload;
//     },
//     fetchGeneralPagesRequestFailure: (state, action) => {
//       state.loading = false;
//       state.error = action.payload;
//     },
//     addGeneralPage: (state, action) => {
//       state.generalPages.push(action.payload);
//     },
//     getDocumentContentRequest: (state) => {
//       state.loading = true;
//       state.error = null;
//     },
//     getDocumentContentRequestSuccess: (state, action) => {
//       state.loading = false;
//       state.documentContent = action.payload;
//     },
//     getDocumentContentRequestFailure: (state, action) => {
//       state.loading = false;
//       state.error = action.payload;
//     },
//     deletePage: (state, action) => {
//         const id = action.payload;
//         state.generalPages = state.generalPages.filter(
//           (generalPage) => generalPage.id !== id
//         );

//     },
//     updatePage: (state, action) => {
//         const updatedData = action.payload;

//         // Update generalPages
//         state.generalPages = state.generalPages.map((generalPage) =>
//           generalPage.id === updatedData.id
//             ? {
//                 ...generalPage,
//                 title: updatedData.title,
//                 description: updatedData.description,
//               }
//             : generalPage
//         );

//         // Update documentContent
//         state.documentContent = state.documentContent.map((content) =>
//           content.id === updatedData.id
//             ? {
//                 ...content,
//                 title: updatedData.title,
//                 description: updatedData.description,
//               }
//             : content
//         );
//       },
//   },
// });

// export const {
//   fetchGeneralPagesRequest,
//   fetchGeneralPageRequestSuccess,
//   fetchGeneralPagesRequestFailure,
//   addGeneralPage,
//   getDocumentContentRequest,
//   getDocumentContentRequestSuccess,
//   getDocumentContentRequestFailure,
//   deletePage,
//   updatePage
// } = generalPagesSlice.actions;

// export default generalPagesSlice.reducer;
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  generalPages: [],
  documentContent: {},
  loading: false,
  error: null,
};

const generalPagesSlice = createSlice({
  name: "generalPages",
  initialState,
  reducers: {
    fetchGeneralPagesRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchGeneralPageRequestSuccess: (state, action) => {
      state.loading = false;
      state.generalPages = action.payload;
    },
    fetchGeneralPagesRequestFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    addGeneralPage: (state, action) => {
      state.generalPages.push(action.payload);
    },
    getDocumentContentRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    getDocumentContentRequestSuccess: (state, action) => {
      state.loading = false;
      state.documentContent = action.payload;
    },
    getDocumentContentRequestFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    deletePage: (state, action) => {
      const id = action.payload;
      state.generalPages = state.generalPages.filter(
        (generalPage) => generalPage.id !== id
      );
    },
    updatePage: (state, action) => {
      const updatedData = action.payload;

      // Update generalPages
      state.generalPages = state.generalPages.map((generalPage) =>
        generalPage.id === updatedData.id
          ? {
              ...generalPage,
              title: updatedData.title,
              description: updatedData.description,
            }
          : generalPage
      );

      // Update documentContent
      state.documentContent = Object.keys(state.documentContent).map(
        (contentId) =>
          contentId === updatedData.id
            ? {
                ...state.documentContent[contentId],
                title: updatedData.title,
                description: updatedData.description,
              }
            : state.documentContent[contentId]
      );
    },
  },
});

export const {
  fetchGeneralPagesRequest,
  fetchGeneralPageRequestSuccess,
  fetchGeneralPagesRequestFailure,
  addGeneralPage,
  getDocumentContentRequest,
  getDocumentContentRequestSuccess,
  getDocumentContentRequestFailure,
  deletePage,
  updatePage,
} = generalPagesSlice.actions;

export default generalPagesSlice.reducer;

