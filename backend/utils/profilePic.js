export const generateProfilePic = (username, gender) => {
  const seed = `${gender === "male" ? "boy" : "girl"}-${encodeURIComponent(username)}`;
  const facialHair = gender === "male" ? 50 : 0;

  return `https://api.dicebear.com/10.x/avataaars/svg?seed=${seed}&facialHairProbability=${facialHair}`;
};
