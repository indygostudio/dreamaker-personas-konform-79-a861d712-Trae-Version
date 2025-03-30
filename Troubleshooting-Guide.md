# Troubleshooting Guide: Recovering Missing Audio and Editing Functionality

This guide provides detailed steps for diagnosing and resolving issues with the audio player transport controls and right-click edit functionality in the Dreamaker AI platform's preview page.

## Table of Contents

1. [Common Issues Overview](#common-issues-overview)
2. [Audio Transport Controls Recovery](#audio-transport-controls-recovery)
3. [Right-Click Edit Menu Functionality](#right-click-edit-menu-functionality)
4. [Browser Settings and Compatibility](#browser-settings-and-compatibility)
5. [Keyboard Shortcuts](#keyboard-shortcuts)
6. [Advanced Troubleshooting](#advanced-troubleshooting)

## Common Issues Overview

Users may encounter the following issues:

- **Missing Audio Transport Controls**: Play, pause, skip, and other controls not visible or not functioning
- **No Audio Playback**: Audio files not playing despite being properly loaded
- **Disabled Right-Click Menu**: Unable to access edit options via right-click
- **Edit Functionality Missing**: Cannot edit track details, lyrics, or artwork

## Audio Transport Controls Recovery

### Issue: Transport Controls Not Visible

1. **Check Visual Settings**:
   - The WaveformVisualizer component has a `showTransportControls` property that must be set to `true`
   - Controls opacity may be set too low, making them difficult to see

   **Solution**: Ensure the visualization component is properly configured:
   ```jsx
   <WaveformVisualizer 
     showTransportControls={true}
     // Other properties...
   />
   ```

2. **Audio Player Container Issues**:
   - The player container may be hidden through CSS or conditional rendering
   
   **Solution**: Check visibility conditions in `AudioSection.tsx`:
   ```jsx
   {(isMusicPlayerVisible || isPlaying) && currentTrack && (
     <AudioSectionAdapter />
   )}
   ```

### Issue: Audio Not Playing

1. **AudioContext Suspended**:
   - Browsers often suspend AudioContext until user interaction occurs
   
   **Solution**: Implement code to resume AudioContext:
   ```javascript
   // Add this to your audio components
   useEffect(() => {
     const resumeAudioContext = () => {
       if (window.audioContext && window.audioContext.state === 'suspended') {
         window.audioContext.resume();
       }
     };
     
     document.addEventListener('click', resumeAudioContext);
     document.addEventListener('touchstart', resumeAudioContext);
     
     return () => {
       document.removeEventListener('click', resumeAudioContext);
       document.removeEventListener('touchstart', resumeAudioContext);
     };
   }, []);
   ```

2. **Media Loading Issues**:
   - Audio files may be failing to load or decode
   
   **Solution**: Implement better error handling and status reporting:
   ```javascript
   waveSurfer.on('error', (err) => {
     console.error('WaveSurfer error:', err);
     // Display user-friendly error message
   });
   ```

3. **Check Browser Console for Errors**:
   - Look for CORS issues, 404 errors, or other network problems
   - Audio codec compatibility issues may appear in console

## Right-Click Edit Menu Functionality

### Issue: Context Menu Not Appearing

1. **ContextMenu Component Integration**:
   - Ensure the track items are properly wrapped with the context menu component
   
   **Solution**: Verify your TrackItem component implements the ContextMenu correctly:
   ```jsx
   <TrackContextMenu
     onPlayClick={() => onTrackPlay(track)}
     onEditClick={isOwner ? handleEditClick : undefined}
     onLyricsClick={isOwner ? handleLyricsClick : undefined}
     onArtworkClick={isOwner ? handleArtworkClick : undefined}
     onDeleteClick={isOwner ? handleDeleteClick : undefined}
   >
     {/* Track item content */}
   </TrackContextMenu>
   ```

2. **Browser Context Menu Settings**:
   - Some browser extensions or settings may block custom context menus
   
   **Solution**: Check browser extensions, particularly those that modify right-click behavior

### Issue: Edit Functions Not Working

1. **Missing Handler Functions**:
   - Handlers for edit operations may not be implemented or properly connected
   
   **Solution**: Ensure all handler functions are implemented:
   ```jsx
   const handleEditClick = (e) => {
     e.stopPropagation();
     if (onEditTrack) {
       onEditTrack(track);
     }
   };
   
   const handleLyricsClick = (e) => {
     e.stopPropagation();
     if (onEditLyrics) {
       onEditLyrics(track);
     }
   };
   ```

2. **Props Not Passed Down Correctly**:
   - Handler functions may not be passed correctly through the component hierarchy
   
   **Solution**: Check that all props are being passed down through all components:
   ```jsx
   <TrackList
     // Other props...
     onEditTrack={handleEditTrack}
     onEditLyrics={handleEditLyrics}
   />
   ```

## Browser Settings and Compatibility

### Browser Compatibility

1. **Audio API Support**:
   - Different browsers have varying levels of support for Web Audio API
   - Latest versions of Chrome, Firefox, Safari, and Edge work best
   
   **Recommended Browsers**:
   - Chrome 70+
   - Firefox 63+
   - Safari 12+
   - Edge 79+ (Chromium-based)

2. **Feature Detection**:
   ```javascript
   // Check if Web Audio API is supported
   if (window.AudioContext || window.webkitAudioContext) {
     // Supported
   } else {
     // Not supported - show fallback UI
   }
   ```

### Privacy and Permission Settings

1. **Autoplay Policies**:
   - Most modern browsers block autoplay with sound
   - User interaction is required before audio can play
   
   **Solution**: Add clear play buttons and inform users they need to interact

2. **Site Permissions**:
   - Check browser permissions for the site
   - Go to Site Settings in your browser and ensure audio is allowed

## Keyboard Shortcuts

These keyboard shortcuts can be used to control the audio player:

| Function | Shortcut (Windows/Linux) | Shortcut (Mac) |
|----------|--------------------------|----------------|
| Play/Pause | Space | Space |
| Skip Forward | Right Arrow | Right Arrow |
| Skip Backward | Left Arrow | Left Arrow |
| Volume Up | Up Arrow | Up Arrow |
| Volume Down | Down Arrow | Down Arrow |
| Toggle Loop | L | L |
| Toggle Shuffle | S | S |
| Mute/Unmute | M | M |

## Advanced Troubleshooting

### Console Diagnostics

Open your browser's Developer Tools (F12 or Cmd+Option+I) and check for errors:

```javascript
// Add this to debug audio issues
console.log('AudioContext state:', window.audioContext?.state);
console.log('Current track:', JSON.stringify(currentTrack));
```

### Local Storage and Cache Issues

1. **Clear Browser Cache**:
   - Cached audio files or stale JavaScript may cause issues
   - Clear browser cache in Settings > Privacy and Security

2. **Check Session Storage**:
   - Playback state is stored in sessionStorage
   - Clear it if you encounter state persistence issues:
   ```javascript
   sessionStorage.removeItem('currentAudioTrack');
   sessionStorage.removeItem('audioPlayerLooping');
   sessionStorage.removeItem('audioPlayerShuffled');
   ```

### Reset Audio System

If all else fails, implement a reset function to completely reinitialize the audio system:

```javascript
// Add this function to your audio context
window.resetAudioState = () => {
  // Stop all playing audio
  if (window.audioContext) {
    window.audioContext.close();
    delete window.audioContext;
  }
  
  // Clear stored state
  sessionStorage.removeItem('currentAudioTrack');
  sessionStorage.removeItem('audioPlayerLooping');
  sessionStorage.removeItem('audioPlayerShuffled');
  
  // Force UI refresh
  setCurrentTrack(null);
  setIsPlaying(false);
  
  // Create fresh AudioContext on next interaction
  console.log('Audio system reset complete - reload the page');
};

// Call this function from the console when needed
// window.resetAudioState();
```

## Contact Support

If you've tried all the troubleshooting steps above and still encounter issues, please contact our support team with the following information:

1. Browser name and version
2. Steps to reproduce the issue
3. Any error messages from the console
4. Screenshots or screen recordings demonstrating the problem

---

© 2025 Dreamaker AI - Technical Support Documentation