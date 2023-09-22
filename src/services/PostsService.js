import axiosInstance from '../services/AxiosInstance';

// API service functions
export function getPosts() {
  return axiosInstance.get('/api/posts/')
    .then((response) => {
      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error('Failed to fetch posts');
      }
    })
    .catch((error) => {
      console.error('Get Posts Error:', error);
      throw error;
    });
}

export function createPost(postData) {
  return axiosInstance.post('/api/posts/', postData)
    .then((response) => {
      if (response.status === 201) {
        return response.data;
      } else {
        throw new Error('Failed to create post');
      }
    })
    .catch((error) => {
      console.error('Create Post Error:', error);
      throw error;
    });
}

export function updatePost(post, postId) {
  return axiosInstance.put(`/api/posts/${postId}/`, post)
    .then((response) => {
      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error('Failed to update post');
      }
    })
    .catch((error) => {
      console.error('Update Post Error:', error);
      throw error;
    });
}

export function deletePost(postId) {
  return axiosInstance.delete(`/api/posts/${postId}/`)
    .then((response) => {
      if (response.status === 204) {
        return true; // Successful deletion
      } else {
        throw new Error('Failed to delete post');
      }
    })
    .catch((error) => {
      console.error('Delete Post Error:', error);
      throw error;
    });
}

// Data formatting function
export function formatPosts(postsData) {
  let posts = [];
  for (let key in postsData) {
    posts.push({ ...postsData[key], id: key });
  }
  return posts;
}
