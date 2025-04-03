import { Scene, SceneContainer, StoryProject } from "../types/storyboard";

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
                      description: description || "",
                      prompt: prompt || "",
                      durationInSeconds: durationInSeconds || 5, // Default to 5 seconds
                      videoUrl: videoUrl || null,
                      imageUrl: imageUrl || null,
                      audioUrl: audioUrl || null
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
    case "ADJUST_SCENE_DURATIONS":
      return state.map(project => {
        if (project.id === action.payload.projectId) {
          return {
            ...project,
            stories: project.stories.map(story => {
              if (story.id === action.payload.storyId) {
                // Update the specific scene's duration
                const updatedScenes = story.scenes.map(scene => {
                  if (scene.id === action.payload.changedSceneId) {
                    return {
                      ...scene,
                      durationInSeconds: action.payload.newDuration
                    };
                  }
                  return scene;
                });
                
                // Calculate total duration
                const totalDuration = updatedScenes.reduce(
                  (sum, scene) => sum + scene.durationInSeconds, 0
                );
                
                return {
                  ...story,
                  updatedAt: new Date(),
                  scenes: updatedScenes,
                  totalDuration
                };
              }
              return story;
            })
          };
        }
        return project;
      });
    case "IMPORT_PROJECTS":
      return action.payload;
    case "REORDER_SCENES":
      return state.map(project => {
        if (project.id === action.payload.projectId) {
          return {
            ...project,
            stories: project.stories.map(story => {
              if (story.id === action.payload.storyId) {
                // Create a map of scenes by ID for quick lookup
                const scenesMap = story.scenes.reduce((map, scene) => {
                  map[scene.id] = scene;
                  return map;
                }, {} as Record<string, Scene>);
                
                // Reorder scenes based on the provided IDs
                const reorderedScenes = action.payload.sceneIds
                  .map(id => scenesMap[id])
                  .filter(Boolean); // Filter out any undefined scenes
                
                return {
                  ...story,
                  updatedAt: new Date(),
                  scenes: reorderedScenes
                };
              }
              return story;
            })
          };
        }
        return project;
      });
    case "REORDER_STORIES":
      return state.map(project => {
        if (project.id === action.payload.projectId) {
          // Create a map of stories by ID for quick lookup
          const storiesMap = project.stories.reduce((map, story) => {
            map[story.id] = story;
            return map;
          }, {} as Record<string, SceneContainer>);
          
          // Reorder stories based on the provided IDs
          const reorderedStories = action.payload.storyIds
            .map(id => storiesMap[id])
            .filter(Boolean); // Filter out any undefined stories
          
          return {
            ...project,
            stories: reorderedStories
          };
        }
        return project;
      });
    default:
      return state;
  }
}