import { Scene, SceneContainer, StoryProject } from "../types/storyboardTypes";

export type StoryboardAction =
  | { type: "SET_PROJECTS"; payload: StoryProject[] }
  | { type: "ADD_PROJECT"; payload: { name: string; id?: string } }
  | { type: "UPDATE_PROJECT"; payload: { id: string; name: string } }
  | { type: "DELETE_PROJECT"; payload: string }
  | { type: "SET_ACTIVE_PROJECT"; payload: string }
  | { type: "ADD_STORY"; payload: { projectId: string; title: string; description: string; id?: string } }
  | { type: "UPDATE_STORY"; payload: { projectId: string; story: SceneContainer } }
  | { type: "DELETE_STORY"; payload: { projectId: string; storyId: string } }
  | { type: "ADD_SCENE"; payload: { projectId: string; storyId: string; description: string; prompt?: string; durationInSeconds?: number; videoUrl?: string; imageUrl?: string; audioUrl?: string; id?: string } }
  | { type: "UPDATE_SCENE"; payload: { projectId: string; storyId: string; scene: Scene } }
  | { type: "DELETE_SCENE"; payload: { projectId: string; storyId: string; sceneId: string } }
  | { type: "ADJUST_SCENE_DURATIONS"; payload: { projectId: string; storyId: string; changedSceneId: string; newDuration: number } }
  | { type: "IMPORT_PROJECTS"; payload: StoryProject[] }
  | { type: "REORDER_SCENES"; payload: { projectId: string; storyId: string; sceneIds: string[] } }
  | { type: "REORDER_STORIES"; payload: { projectId: string; storyIds: string[] } };

export function storyboardReducer(state: StoryProject[], action: StoryboardAction): StoryProject[] {
  switch (action.type) {
    case "SET_PROJECTS":
      return action.payload;
    case "ADD_PROJECT": {
      const newProject = { 
        id: action.payload.id || crypto.randomUUID(), 
        name: action.payload.name, 
        stories: [] 
      };
      return [...state, newProject];
    }
    case "UPDATE_PROJECT":
      return state.map(project =>
        project.id === action.payload.id ? { ...project, name: action.payload.name } : project
      );
    case "DELETE_PROJECT":
      return state.filter(project => project.id !== action.payload);
    case "ADD_STORY": {
      const { projectId, title, description, id } = action.payload;
      const newId = id || crypto.randomUUID();
      const now = new Date();
      
      return state.map(project =>
        project.id === projectId
          ? {
              ...project,
              stories: [
                ...project.stories,
                {
                  id: newId,
                  title,
                  description,
                  scenes: [],
                  createdAt: now,
                  updatedAt: now
                }
              ]
            }
          : project
      );
    }
    case "UPDATE_STORY":
      return state.map(project =>
        project.id === action.payload.projectId
          ? {
              ...project,
              stories: project.stories.map(story =>
                story.id === action.payload.story.id ? {
                  ...action.payload.story,
                  updatedAt: new Date()  // Ensure we update the timestamp
                } : story
              )
            }
          : project
      );
    case "DELETE_STORY":
      return state.map(project =>
        project.id === action.payload.projectId
          ? {
              ...project,
              stories: project.stories.filter(story => story.id !== action.payload.storyId)
            }
          : project
      );
    case "ADD_SCENE": {
      const { projectId, storyId, description, prompt, durationInSeconds, videoUrl, imageUrl, audioUrl, id } = action.payload;
      const newSceneId = id || crypto.randomUUID();
      
      return state.map(project => {
        if (project.id === projectId) {
          return {
            ...project,
            stories: project.stories.map(story => {
              if (story.id === storyId) {
                return {
                  ...story,
                  updatedAt: new Date(), // Update the timestamp
                  scenes: [
                    ...story.scenes,
                    {
                      id: newSceneId,
                      imageUrl: imageUrl || null,
                      videoUrl: videoUrl || null,
                      audioUrl: audioUrl || null,
                      prompt: prompt || "",
                      description: description,
                      durationInSeconds: durationInSeconds || 10
                    }
                  ]
                };
              }
              return story;
            })
          };
        }
        return project;
      });
    }
    case "UPDATE_SCENE":
      return state.map(project => {
        if (project.id === action.payload.projectId) {
          return {
            ...project,
            stories: project.stories.map(story => {
              if (story.id === action.payload.storyId) {
                return {
                  ...story,
                  updatedAt: new Date(), // Update the timestamp
                  scenes: story.scenes.map(scene =>
                    scene.id === action.payload.scene.id ? action.payload.scene : scene
                  )
                };
              }
              return story;
            })
          };
        }
        return project;
      });
    case "DELETE_SCENE":
      return state.map(project => {
        if (project.id === action.payload.projectId) {
          return {
            ...project,
            stories: project.stories.map(story => {
              if (story.id === action.payload.storyId) {
                return {
                  ...story,
                  updatedAt: new Date(), // Update the timestamp
                  scenes: story.scenes.filter(scene => scene.id !== action.payload.sceneId)
                };
              }
              return story;
            })
          };
        }
        return project;
      });
    case "ADJUST_SCENE_DURATIONS": {
      const { projectId, storyId, changedSceneId, newDuration } = action.payload;
      return state.map(project => {
        if (project.id === projectId) {
          return {
            ...project,
            stories: project.stories.map(story => {
              if (story.id === storyId) {
                const totalDuration = story.totalDuration || story.scenes.reduce((acc, scene) => acc + scene.durationInSeconds, 0);
                const otherScenesDuration = story.scenes
                  .filter(scene => scene.id !== changedSceneId)
                  .reduce((acc, scene) => acc + scene.durationInSeconds, 0);
                const remainingDuration = totalDuration - newDuration;
                const numberOfOtherScenes = story.scenes.length - 1;
                const durationPerScene = numberOfOtherScenes > 0 ? Math.max(1, remainingDuration / numberOfOtherScenes) : 1;
                
                return {
                  ...story,
                  updatedAt: new Date(), // Update the timestamp
                  scenes: story.scenes.map(scene => {
                    if (scene.id === changedSceneId) {
                      return { ...scene, durationInSeconds: newDuration };
                    } else {
                      return { ...scene, durationInSeconds: durationPerScene };
                    }
                  })
                };
              }
              return story;
            })
          };
        }
        return project;
      });
    }
    case "IMPORT_PROJECTS": {
      return action.payload.map(project => ({
        ...project,
        stories: project.stories.map(story => ({
          ...story,
          createdAt: new Date(story.createdAt),
          updatedAt: new Date(story.updatedAt),
          scenes: story.scenes
        }))
      }));
    }
    case "REORDER_SCENES": {
      return state.map((project) => {
        if (project.id === action.payload.projectId) {
          const story = project.stories.find((s) => s.id === action.payload.storyId);
          if (story) {
            const reorderedScenes = action.payload.sceneIds.map(
              (id) => story.scenes.find((s) => s.id === id)!
            );
            
            return {
              ...project,
              stories: project.stories.map((s) => 
                s.id === action.payload.storyId 
                  ? { 
                      ...s, 
                      updatedAt: new Date(), // Update the timestamp
                      scenes: reorderedScenes 
                    } 
                  : s
              )
            };
          }
        }
        return project;
      });
    }
    case "REORDER_STORIES": {
      return state.map((project) => {
        if (project.id === action.payload.projectId) {
          const reorderedStories = action.payload.storyIds.map(
            (id) => project.stories.find((s) => s.id === id)!
          );
          
          return {
            ...project,
            stories: reorderedStories
          };
        }
        return project;
      });
    }
    default:
      return state;
  }
}
