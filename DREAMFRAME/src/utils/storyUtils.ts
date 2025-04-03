
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
  const scenes = assignSceneDurations(sceneDescriptions, totalSeconds);
  
  console.log("Final scenes with durations:", scenes);
  return scenes;
}

/**
 * Analyzes scene content and assigns appropriate durations
 * - Complex/important scenes get longer durations (10s)
 * - Simple/transition scenes get shorter durations (5s)
 * - Ensures the total duration fits within the target timeframe
 */
function assignSceneDurations(
  sceneDescriptions: string[],
  totalSeconds: number
): SceneInfo[] {
  // Calculate importance scores for each scene
  const importanceScores = sceneDescriptions.map((desc, index) => {
    let score = 0;
    
    // First and last scenes are important for establishing and concluding
    if (index === 0 || index === sceneDescriptions.length - 1) {
      score += 3;
    }
    
    // Scenes with action and emotion keywords get higher scores
    const actionKeywords = [
      "run", "jump", "fight", "explode", "crash", "race", "chase", "flee",
      "escape", "battle", "attack", "defend", "transform", "morph", "change",
      "dance", "climb", "fall", "shoot", "throw", "catch", "swing", "push", "pull",
      "rush", "slam", "break", "build", "create", "destroy", "move", "shake"
    ];
    
    const emotionKeywords = [
      "love", "hate", "fear", "joy", "sadness", "anger", "surprise", "disgust",
      "crying", "laughing", "screaming", "shouting", "celebrating", "mourning",
      "terrified", "excited", "nervous", "anxious", "happy", "desperate", "thrilled",
      "worried", "shocked", "amazed", "embarrassed", "proud", "ashamed", "grateful"
    ];
    
    const importantKeywords = [
      "discover", "reveal", "transform", "climax", "battle", "final",
      "begin", "start", "end", "crucial", "important", "key", "critical",
      "epic", "dramatic", "intense", "powerful", "significant", "central",
      "turning point", "revelation", "confrontation", "decision", "choice",
      "crisis", "danger", "victory", "defeat", "success", "failure", "challenge"
    ];

    const settingKeywords = [
      "castle", "mountain", "ocean", "forest", "city", "village", "space",
      "desert", "underwater", "sky", "cave", "mansion", "laboratory",
      "temple", "ruins", "island", "battlefield", "kingdom", "dimension",
      "planet", "galaxy", "universe", "world", "realm", "domain", "territory"
    ];
    
    // Check for keywords in the description
    for (const keyword of actionKeywords) {
      if (desc.toLowerCase().includes(keyword)) {
        score += 1.5;
      }
    }
    
    for (const keyword of emotionKeywords) {
      if (desc.toLowerCase().includes(keyword)) {
        score += 1.5;
      }
    }
    
    for (const keyword of importantKeywords) {
      if (desc.toLowerCase().includes(keyword)) {
        score += 2;
      }
    }

    for (const keyword of settingKeywords) {
      if (desc.toLowerCase().includes(keyword)) {
        score += 1;
      }
    }
    
    // Length can indicate complexity (more detail = potentially more important)
    score += Math.min(desc.length / 40, 2.5); // Adjusted to be more sensitive to length
    
    // Check for dialogue (quotation marks)
    if (desc.includes('"') || desc.includes("'")) {
      score += 2;
    }
    
    return score;
  });
  
  // Calculate max number of scenes we can have if all were 5 seconds
  const maxPossibleScenes = Math.floor(totalSeconds / 5);
  
  // If we have more descriptions than possible scenes, we need to prioritize
  const targetSceneCount = Math.min(sceneDescriptions.length, maxPossibleScenes);
  
  // Sort by importance but keep track of original index
  const indexedScores = importanceScores.map((score, index) => ({ score, index }));
  indexedScores.sort((a, b) => b.score - a.score);
  
  // Take top N based on importance
  const selectedIndices = indexedScores
    .slice(0, targetSceneCount)
    .map(item => item.index)
    .sort((a, b) => a - b); // Sort back to original order
  
  // Create scenes with appropriate durations based on importance scores
  const scenes: SceneInfo[] = selectedIndices.map(index => {
    const description = sceneDescriptions[index];
    const score = importanceScores[index];
    
    // Determine duration based on importance score
    // Higher scores get longer durations
    const durationInSeconds = score >= 4 ? 10 : 5;
    
    return {
      description,
      durationInSeconds
    };
  });
  
  // Total duration check - adjust if needed to fit target duration
  const totalGeneratedDuration = scenes.reduce((sum, scene) => sum + scene.durationInSeconds, 0);
  
  // If we're significantly under time and have scenes, extend some scenes
  if (totalGeneratedDuration < totalSeconds * 0.8 && scenes.length > 0) {
    // Sort by importance again
    const scenesWithScores = scenes.map((scene, idx) => ({
      scene,
      index: idx,
      score: importanceScores[selectedIndices[idx]]
    }));
    
    scenesWithScores.sort((a, b) => b.score - a.score);
    
    // Calculate seconds to distribute
    const secondsToAdd = Math.min(totalSeconds - totalGeneratedDuration, scenes.length * 5);
    let secondsRemaining = secondsToAdd;
    
    // Distribute extra seconds to most important scenes first
    let i = 0;
    while (secondsRemaining > 0 && i < scenesWithScores.length) {
      // Only extend if scene isn't already at 10 seconds
      if (scenesWithScores[i].scene.durationInSeconds < 10) {
        const secondsToAddToThisScene = Math.min(
          10 - scenesWithScores[i].scene.durationInSeconds,
          secondsRemaining
        );
        
        scenes[scenesWithScores[i].index].durationInSeconds += secondsToAddToThisScene;
        secondsRemaining -= secondsToAddToThisScene;
      }
      
      i++;
    }
  }
  
  // Generate additional scenes if we have a lot of remaining time
  if (totalGeneratedDuration < totalSeconds * 0.7 && sceneDescriptions.length >= 2) {
    // Create additional transitional scenes or extend existing scenes
    const remainingTime = totalSeconds - totalGeneratedDuration;
    const additionalScenes = Math.floor(remainingTime / 5);
    
    if (additionalScenes > 0) {
      // Create transitional scenes between existing scenes
      const newScenes: SceneInfo[] = [];
      
      for (let i = 0; i < scenes.length - 1 && newScenes.length < additionalScenes; i++) {
        // Create a transitional scene by combining elements from adjacent scenes
        const currentScene = scenes[i].description;
        const nextScene = scenes[i + 1].description;
        
        // Extract key elements for transition
        const currentWords = currentScene.split(' ').slice(-3).join(' ');
        const nextWords = nextScene.split(' ').slice(0, 3).join(' ');
        
        const transitionDesc = `The scene transitions from ${currentWords}... to ${nextWords}...`;
        
        newScenes.push({
          description: transitionDesc,
          durationInSeconds: 5
        });
      }
      
      // Add establishing shots if we still need more scenes
      const establishingDescriptions = [
        "An establishing shot sets the scene",
        "The environment is revealed",
        "A wide shot shows the full setting",
        "The camera pans across the location",
        "The atmosphere of the scene is established"
      ];
      
      while (newScenes.length < additionalScenes) {
        const randomDesc = establishingDescriptions[Math.floor(Math.random() * establishingDescriptions.length)];
        newScenes.push({
          description: randomDesc,
          durationInSeconds: 5
        });
      }
      
      // Intersperse new scenes among existing ones
      let insertAt = 1;
      for (const newScene of newScenes) {
        if (insertAt < scenes.length) {
          scenes.splice(insertAt, 0, newScene);
          insertAt += 2; // Skip ahead to insert evenly
        } else {
          // Append at the end if we run out of insertion points
          scenes.push(newScene);
        }
      }
    }
  }
  
  return scenes;
}
