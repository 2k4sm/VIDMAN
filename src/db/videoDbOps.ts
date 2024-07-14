import Video from "../models/video";

export const createVideo = async (userId : string,filename : string,size : number,videoId : string) => {
    try {
      const video = await Video.create({userId,filename,size,videoId});
      return video;
    } catch (error) {
      throw new Error('Error creating video: ' + error);
    }
  };
  
  
export const getVideosByUserId = async (userId: string) => {
  try {
    const videos = await Video.findAll({ where: { userId } });
    return videos;
  } catch (error) {
    throw new Error('Error fetching videos: ' + error);
  }
};


export const getVideoByVideoId = async (videoId: string) => {
  try {
    const video = await Video.findOne({ where: { videoId } });
    return video;
  } catch (error) {
    throw new Error('Error fetching video: ' + error);
  }
};

// Update video URL
export const updateVideoUrl = async (id: string, url: string) => {
  try {
    const video = await Video.findByPk(id);
    if (video) {
      video.setDataValue('url', url);
      await video.save();
    } else {
      throw new Error('Video not found');
    }
  } catch (error) {
    throw new Error('Error updating video URL: ' + error);
  }
};

// Delete video
export const deleteVideo = async (id: string) => {
  try {
    const video = await Video.findByPk(id);
    if (video) {
      await video.destroy();
    } else {
      throw new Error('Video not found');
    }
  } catch (error) {
    throw new Error('Error deleting video: ' + error);
  }
};

