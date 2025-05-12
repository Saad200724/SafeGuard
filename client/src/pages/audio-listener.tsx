import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useQuery } from "@tanstack/react-query";
import { Child, AudioSession } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Mic,
  Play,
  Pause,
  RefreshCw,
  Clock,
  Calendar,
  Headphones,
  File
} from "lucide-react";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";

const AudioListenerPage = () => {
  const { toast } = useToast();
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Fetch children data
  const { data: childrenData, isLoading: childrenLoading } = useQuery({
    queryKey: ["/api/children"],
    onSuccess: (data) => {
      if (data && data.length > 0 && !selectedChild) {
        setSelectedChild(data[0]);
      }
    },
  });

  // Fetch audio sessions for the selected child
  const { data: audioSessionsData, isLoading: sessionsLoading, refetch } = useQuery({
    queryKey: ["/api/audio-sessions", selectedChild?.id],
    enabled: !!selectedChild,
  });

  const handleStartRecording = () => {
    setIsRecording(true);
    toast({
      title: "Recording started",
      description: "The audio recording has been started.",
    });
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    toast({
      title: "Recording stopped",
      description: "The audio recording has been stopped and saved.",
    });
  };

  const handlePlayAudio = () => {
    setIsPlaying(!isPlaying);
  };

  // Format time from timestamp
  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Format date from timestamp
  const formatDate = (timestamp: Date) => {
    return timestamp.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  // Format duration in seconds
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  // Sample audio sessions
  const sampleAudioSessions = [
    {
      id: 1,
      timestamp: new Date(),
      duration: 120,
      recordingUrl: "#",
    },
    {
      id: 2,
      timestamp: new Date(Date.now() - 3600000),
      duration: 60,
      recordingUrl: "#",
    },
    {
      id: 3,
      timestamp: new Date(Date.now() - 7200000),
      duration: 180,
      recordingUrl: "#",
    },
  ];

  const audioSessions = audioSessionsData || sampleAudioSessions;

  return (
    <MainLayout title="Audio Listener">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Audio Monitoring</h2>
          <div className="flex space-x-2">
            {isRecording ? (
              <Button
                variant="destructive"
                onClick={handleStopRecording}
                className="inline-flex items-center"
              >
                <Pause className="mr-2 h-4 w-4" />
                Stop Recording
              </Button>
            ) : (
              <Button
                onClick={handleStartRecording}
                className="inline-flex items-center"
              >
                <Mic className="mr-2 h-4 w-4" />
                Start Recording
              </Button>
            )}
          </div>
        </div>

        <Tabs defaultValue="live" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="live">
              <Headphones className="mr-2 h-4 w-4" />
              Live Audio
            </TabsTrigger>
            <TabsTrigger value="recordings">
              <File className="mr-2 h-4 w-4" />
              Recordings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="live">
            <Card>
              <CardHeader className="border-b border-gray-200">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Mic className="mr-2 h-5 w-5" />
                    Live Audio Feed
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="mr-1 h-4 w-4" />
                    Last update: {new Date().toLocaleTimeString()}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="bg-gray-100 rounded-lg overflow-hidden shadow-inner p-6 flex flex-col items-center justify-center min-h-[300px]">
                  <div className="flex flex-col items-center justify-center w-full">
                    {isRecording ? (
                      <>
                        <div className="relative w-32 h-32 bg-red-100 rounded-full flex items-center justify-center mb-6">
                          <Mic className="h-12 w-12 text-red-600" />
                          <div className="absolute inset-0 rounded-full border-4 border-red-500 animate-ping opacity-75"></div>
                        </div>
                        <p className="text-red-600 font-medium mb-4">Recording in progress...</p>
                        <div className="flex items-center justify-center space-x-2 w-full max-w-md mb-6">
                          <div className="h-8 w-1 bg-gray-300 rounded-full animate-pulse"></div>
                          <div className="h-16 w-1 bg-red-500 rounded-full animate-pulse"></div>
                          <div className="h-12 w-1 bg-gray-300 rounded-full animate-pulse"></div>
                          <div className="h-20 w-1 bg-red-500 rounded-full animate-pulse"></div>
                          <div className="h-10 w-1 bg-gray-300 rounded-full animate-pulse"></div>
                          <div className="h-14 w-1 bg-red-500 rounded-full animate-pulse"></div>
                          <div className="h-8 w-1 bg-gray-300 rounded-full animate-pulse"></div>
                          <div className="h-12 w-1 bg-red-500 rounded-full animate-pulse"></div>
                          <div className="h-16 w-1 bg-gray-300 rounded-full animate-pulse"></div>
                          <div className="h-10 w-1 bg-red-500 rounded-full animate-pulse"></div>
                        </div>
                        <div className="text-sm text-gray-500">Recording time: 00:45</div>
                      </>
                    ) : (
                      <>
                        <Headphones className="h-16 w-16 text-gray-400 mb-4" />
                        <p className="text-gray-600 mb-2">
                          Live audio monitoring is not currently active.
                        </p>
                        <p className="text-sm text-gray-500 mb-6">
                          Click the "Start Recording" button to begin monitoring audio.
                        </p>
                        <Button onClick={handleStartRecording}>
                          <Mic className="mr-2 h-4 w-4" />
                          Start Recording
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                <div className="mt-6 bg-blue-50 border border-blue-100 rounded-md p-4 text-sm text-blue-800">
                  <p className="font-medium">Important Privacy Notice</p>
                  <p className="mt-1">
                    Audio monitoring should only be used in accordance with local laws and regulations. 
                    Always ensure you have the appropriate permissions to monitor your child's device.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recordings">
            <Card>
              <CardHeader className="border-b border-gray-200">
                <CardTitle className="flex items-center">
                  <File className="mr-2 h-5 w-5" />
                  Audio Recordings
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {audioSessions.length === 0 ? (
                  <div className="text-center py-8">
                    <Headphones className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                    <p className="text-gray-600">No audio recordings found.</p>
                    <p className="text-sm text-gray-500 mt-1 mb-4">
                      Start a recording to capture audio from your child's device.
                    </p>
                    <Button onClick={handleStartRecording}>
                      <Mic className="mr-2 h-4 w-4" />
                      Start New Recording
                    </Button>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Recording Date</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Playback</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {audioSessions.map((session) => (
                        <TableRow key={session.id}>
                          <TableCell>
                            <div className="font-medium">
                              {formatDate(session.timestamp)}
                            </div>
                            <div className="text-sm text-gray-500">
                              {formatTime(session.timestamp)}
                            </div>
                          </TableCell>
                          <TableCell>
                            {formatDuration(session.duration)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-4">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={handlePlayAudio}
                              >
                                {isPlaying && session.id === 1 ? (
                                  <Pause className="h-4 w-4" />
                                ) : (
                                  <Play className="h-4 w-4" />
                                )}
                              </Button>
                              <Slider
                                disabled={!isPlaying || session.id !== 1}
                                defaultValue={[0]}
                                max={session.duration}
                                step={1}
                                className="w-32"
                              />
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              Download
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default AudioListenerPage;
