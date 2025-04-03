type SceneInfo = {
  description: string;
  durationInSeconds: number;
};

/**
 * Analyzes a story description and generates appropriate scenes with durations
 * Each scene will be 5 or 10 seconds based on importance and content
 */
export function generateScenesFromStory(
  storyDescription: string,
  totalDurationInMinutes: number
): SceneInfo[] {
  console.log("Generating scenes from story:", storyDescription);
  console.log("Total duration in minutes:", totalDurationInMinutes);

  // Split the story by sentences and create a scene for each significant segment
  const sentences = storyDescription
    .split(/[.!?]+/)
    .map(s => s.trim())
    .filter(s => s.length > 0);
  
  console.log("Extracted sentences:", sentences);

  // Group sentences into logical scenes based on narrative flow
  const sceneDescriptions: string[] = [];
  let currentScene = "";

  sentences.forEach((sentence, index) => {
    // Start a new scene if current would be too long or contains a scene transition
    const hasTransitionWord = /\b(then|next|suddenly|later|after|before|meanwhile|eventually|following|subsequently|afterward|earlier|soon)\b/i.test(sentence);
    const hasNewSetting = /\b(inside|outside|interior|exterior|at the|in the|at a|in a|arrives at|returns to|enters|location)\b/i.test(sentence);
    const hasNewAction = /\b(begin|start|stops|arrives|leaves|enters|exits|appears|disappears|meets|finds|discovers|realizes|decides|continues|ends)\b/i.test(sentence);
    const hasEmotionalShift = /\b(happy|sad|angry|surprised|shocked|afraid|scared|confused|relieved|excited|nervous|worried|calm|peaceful|frustrated)\b/i.test(sentence);
    const hasTimePassing = /\b(day|night|morning|evening|afternoon|hour|minute|second|moment|instant|days|weeks|months|years)\b/i.test(sentence);
    
    const shouldStartNewScene = 
      (currentScene.length > 80) || // Shorter scenes for better visual storytelling
      hasTransitionWord || 
      hasNewSetting || 
      hasNewAction || 
      hasEmotionalShift ||
      hasTimePassing ||
      index === 0; // Always start with a new scene
    
    if (shouldStartNewScene && currentScene) {
      sceneDescriptions.push(currentScene);
      currentScene = sentence;
    } else if (shouldStartNewScene) {
      currentScene = sentence;
    } else {
      // Combine with the current scene
      currentScene += ". " + sentence;
    }
  });
  
  // Add the last scene if it exists
  if (currentScene) {
    sceneDescriptions.push(currentScene);
  }

  console.log("Initial scene grouping:", sceneDescriptions);

  // Ensure we have at least one scene
  if (sceneDescriptions.length === 0) {
    sceneDescriptions.push(storyDescription);
  }

  // If we have very few scenes but a long description, try to break it up more
  if (sceneDescriptions.length < 3 && storyDescription.length > 200) {
    // Start over with a more aggressive approach to scene splitting
    sceneDescriptions.length = 0;
    currentScene = "";
    
    sentences.forEach((sentence) => {
      // Create a new scene more frequently for longer descriptions
      if (currentScene.length > 60 || currentScene === "") {
        if (currentScene) {
          sceneDescriptions.push(currentScene);
        }
        currentScene = sentence;
      } else {
        currentScene += ". " + sentence;
      }
    });
    
    if (currentScene) {
      sceneDescriptions.push(currentScene);
    }
    
    console.log("Refined scene grouping for long stories:", sceneDescriptions);
  }
  
  // Calculate total available seconds based on input duration
  const totalSeconds = totalDurationInMinutes * 60;
  
  // Create scenes with dynamic durations
  return assignSceneDurations(sceneDescriptions, totalSeconds);
}

/**
 * Assigns durations to scenes based on their content and importance
 * Ensures the total duration matches the requested duration
 */
function assignSceneDurations(sceneDescriptions: string[], totalSeconds: number): SceneInfo[] {
  // If we have no scenes, return an empty array
  if (sceneDescriptions.length === 0) return [];
  
  // Calculate a base duration per scene
  let baseDurationPerScene = Math.floor(totalSeconds / sceneDescriptions.length);
  
  // Ensure minimum duration of 3 seconds per scene
  baseDurationPerScene = Math.max(baseDurationPerScene, 3);
  
  // Analyze scenes for importance factors
  const sceneImportance = sceneDescriptions.map(scene => {
    // Factors that might make a scene more important
    const wordCount = scene.split(/\s+/).length;
    const hasAction = /\b(run|jump|fight|explode|crash|fall|rise|dance|move|attack|defend|escape|chase)\b/i.test(scene);
    const hasEmotionalContent = /\b(love|hate|fear|joy|sadness|anger|surprise|disgust|trust|anticipation)\b/i.test(scene);
    const hasDialogue = /["'].*["']/i.test(scene);
    const isIntroOrConclusion = (sceneDescriptions.indexOf(scene) === 0 || 
                               sceneDescriptions.indexOf(scene) === sceneDescriptions.length - 1);
    
    // Calculate importance score
    let importance = 1.0; // Base importance
    
    // Adjust based on factors
    if (wordCount > 20) importance += 0.5;
    if (hasAction) importance += 0.3;
    if (hasEmotionalContent) importance += 0.3;
    if (hasDialogue) importance += 0.4;
    if (isIntroOrConclusion) importance += 0.2;
    
    return importance;
  });
  
  // Calculate total importance to normalize
  const totalImportance = sceneImportance.reduce((sum, imp) => sum + imp, 0);
  
  // Assign durations based on importance
  const scenes: SceneInfo[] = sceneDescriptions.map((description, index) => {
    // Calculate this scene's share of the total duration
    const importanceRatio = sceneImportance[index] / totalImportance;
    let duration = Math.round(totalSeconds * importanceRatio);
    
    // Ensure minimum duration
    duration = Math.max(duration, 3);
    
    return {
      description,
      durationInSeconds: duration
    };
  });
  
  // Adjust to match total duration exactly
  const currentTotalDuration = scenes.reduce((sum, scene) => sum + scene.durationInSeconds, 0);
  const durationDifference = totalSeconds - currentTotalDuration;
  
  if (durationDifference !== 0) {
    // Distribute the difference proportionally
    distributeTimeDifference(scenes, durationDifference);
  }
  
  return scenes;
}

/**
 * Distributes a time difference across scenes proportionally
 */
function distributeTimeDifference(scenes: SceneInfo[], difference: number): void {
  // If the difference is small, just add/subtract from the longest/shortest scene
  if (Math.abs(difference) <= 2) {
    if (difference > 0) {
      // Add time to the longest scene
      const longestSceneIndex = scenes.reduce(
        (maxIndex, scene, index, arr) => 
          scene.durationInSeconds > arr[maxIndex].durationInSeconds ? index : maxIndex, 
        0
      );
      scenes[longestSceneIndex].durationInSeconds += difference;
    } else {
      // Remove time from the longest scene
      const longestSceneIndex = scenes.reduce(
        (maxIndex, scene, index, arr) => 
          scene.durationInSeconds > arr[maxIndex].durationInSeconds ? index : maxIndex, 
        0
      );
      scenes[longestSceneIndex].durationInSeconds += difference; // difference is negative
    }
    return;
  }
  
  // For larger differences, distribute proportionally
  const totalDuration = scenes.reduce((sum, scene) => sum + scene.durationInSeconds, 0);
  let remainingDifference = difference;
  
  // First pass: distribute proportionally
  for (let i = 0; i < scenes.length && Math.abs(remainingDifference) > 0; i++) {
    const scene = scenes[i];
    const proportion = scene.durationInSeconds / totalDuration;
    const adjustment = Math.round(difference * proportion);
    
    // Ensure we don't make any scene too short
    if (scene.durationInSeconds + adjustment >= 3) {
      scene.durationInSeconds += adjustment;
      remainingDifference -= adjustment;
    }
  }
  
  // Second pass: distribute any remaining difference one second at a time
  let index = 0;
  while (remainingDifference > 0) {
    scenes[index % scenes.length].durationInSeconds += 1;
    remainingDifference -= 1;
    index++;
  }
  
  while (remainingDifference < 0) {
    const currentIndex = index % scenes.length;
    if (scenes[currentIndex].durationInSeconds > 3) {
      scenes[currentIndex].durationInSeconds -= 1;
      remainingDifference += 1;
    }
    index++;
    
    // Safety check to prevent infinite loop if all scenes are at minimum duration
    if (index > scenes.length * 2) break;
  }
}