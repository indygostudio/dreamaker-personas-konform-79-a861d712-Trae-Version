/**
 * Utility function to scroll to a specific section with smooth behavior
 * @param sectionId - The ID of the section to scroll to
 * @param offset - Optional offset from the top (e.g., for navbar height)
 */
export const scrollToSection = (sectionId: string, offset: number = 0): void => {
  const section = document.getElementById(sectionId);
  if (section) {
    const navbarHeight = document.querySelector('nav')?.offsetHeight || 0;
    const targetPosition = section.getBoundingClientRect().top + window.scrollY - navbarHeight - offset;
    
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }
};