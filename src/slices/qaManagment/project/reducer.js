import { createSlice } from "@reduxjs/toolkit";

const initialState={
    project:[],
    loading:false,
    error:null,
}

const projectSlice = createSlice({
    name:"project",
    initialState,
    reducers:{
        fetchProject(state){
            state.loading=true;
            state.error=null;
        },
        fetchProjectSuccess(state,action){
            state.project=action.payload;
            state.loading=false;
        },
        fetchProjectFailure(state,action){
            state.error=action.payload;
        },
        addProject(state, action) {
            state.project.push(action.payload);
        },
        updateProject(state, action) {
            const updatedProject = action.payload;
            state.project = state.project.map(project =>
              project.id === updatedProject.editedEntity.id ? { ...project, ...updatedProject.editedEntity } : project
            );
          
        },
        deleteProject(state, action) {
            const id = action.payload;
            state.project = state.project.filter(project => project.id !== id);
        }
    }
})

export const {fetchProject,fetchProjectSuccess,fetchProjectFailure, addProject, updateProject, deleteProject}=projectSlice.actions;

export default projectSlice.reducer;