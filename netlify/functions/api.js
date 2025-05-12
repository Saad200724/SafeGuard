// Serverless function for API endpoints

export async function handler(event, context) {
  // Parse path and query parameters
  const path = event.path.replace(/^\/\.netlify\/functions\/api/, '');
  const method = event.httpMethod;

  console.log(`Processing ${method} request to ${path}`);

  // Handle different API routes
  try {
    // Children endpoints
    if (path === '/children' && method === 'GET') {
      return {
        statusCode: 200,
        body: JSON.stringify([
          {
            id: 1,
            name: "Emma",
            age: 12,
            deviceId: "device-123",
            parentId: 1
          },
          {
            id: 2,
            name: "Michael",
            age: 9,
            deviceId: "device-456",
            parentId: 1
          }
        ])
      };
    }

    // Activities endpoints
    if (path.startsWith('/activities') && method === 'GET') {
      const activities = [
        {
          id: 1,
          type: "app_usage",
          title: "App Usage",
          description: "YouTube: 45 minutes",
          timestamp: new Date().toISOString(),
          childId: 1
        },
        {
          id: 2,
          type: "location_update",
          title: "Location",
          description: "Arrived at school",
          timestamp: new Date().toISOString(),
          childId: 1
        },
        {
          id: 3,
          type: "screen_time",
          title: "Screen Time",
          description: "1 hour of total usage today",
          timestamp: new Date().toISOString(),
          childId: 2
        }
      ];

      // Filter by childId if specified
      if (path.includes('/activities/')) {
        const childId = parseInt(path.split('/').pop());
        return {
          statusCode: 200,
          body: JSON.stringify(activities.filter(a => a.childId === childId))
        };
      }

      return {
        statusCode: 200,
        body: JSON.stringify(activities)
      };
    }

    // Blocked sites endpoints
    if (path.startsWith('/blocked-sites') && method === 'GET') {
      const blockedSites = [
        {
          id: 1,
          url: "socialmedia-x.com",
          reason: "Social Media",
          active: true,
          childId: 1
        },
        {
          id: 2,
          url: "games-y.com",
          reason: "Gaming",
          active: true,
          childId: 1
        },
        {
          id: 3,
          url: "video-streaming-z.com",
          reason: "Video Streaming",
          active: false,
          childId: 2
        }
      ];

      // Filter by childId if specified
      if (path.includes('/blocked-sites/')) {
        const childId = parseInt(path.split('/').pop());
        return {
          statusCode: 200,
          body: JSON.stringify(blockedSites.filter(s => s.childId === childId))
        };
      }

      return {
        statusCode: 200,
        body: JSON.stringify(blockedSites)
      };
    }

    // Device settings endpoints
    if (path.startsWith('/device-settings') && method === 'GET') {
      const deviceSettings = {
        id: 1,
        internetAccess: true,
        appInstallation: false,
        screenTimeBonus: false,
        childId: 1
      };

      return {
        statusCode: 200,
        body: JSON.stringify(deviceSettings)
      };
    }

    // Default response for unhandled routes
    return {
      statusCode: 404,
      body: JSON.stringify({ error: 'Not Found' })
    };

  } catch (error) {
    console.error('API function error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' })
    };
  }
}
