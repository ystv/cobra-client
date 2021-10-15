import React from "react";
import { gql, useSubscription } from "@apollo/client";
import { Card, Collapse, Spin, Typography, Statistic } from "antd";
import { formatBitPerSec, ConvertMinutes } from "../commonFunctions";

const COMMENTS_SUBSCRIPTION = gql`
  subscription {
    StreamAppsUpdate {
      srt {
        name
        url
        clients
        created
      }
      rtmp {
        name
        streams {
          name
          time
          bwIn
          bytesIn
          bwOut
          bytesOut
          bwAudio
          bwVideo
          clients {
            id
            address
            time
            flashVersion
            dropped
            avSync
            timestamp
            publishing

            active
          }
          meta {
            video {
              width
              height
              framerate
              codec
              profile
              compat
              level
            }
            audio {
              codec
              profile
              channels
              sampleRate
            }
          }
        }
      }
    }
  }
`;

function Stats() {
  const ServerStatus = useSubscription(COMMENTS_SUBSCRIPTION);

  function ListStats() {
    return (
      <>
        {ServerStatus.loading || ServerStatus.error !== undefined ? (
          <Spin />
        ) : (
          <>
            {ServerStatus.data.StreamAppsUpdate.rtmp.map(
              (e: any, i: number) => {
                let res = <></>;
                res = e.streams.map((stream: any, i: number) => (
                  <Card className="Stream-Card" key={i}>
                    <small>{`${stream.meta.video.width}x${stream.meta.video.height} ${stream.meta.video.framerate}p`}</small>
                    <Typography.Title
                      level={3}
                      copyable={{
                        text: `rtmp://${process.env.REACT_APP_RTMP}/${e.name}/${stream.name}`,
                      }}
                    >
                      {stream.name}
                    </Typography.Title>
                    <small>
                      {stream.alias ? `Key: ${stream.name}` : "No alias"}
                    </small>
                    <Statistic
                      title="Time"
                      value={ConvertMinutes(stream.time)}
                    />
                    <Statistic
                      title="Connected Devices"
                      value={stream.nclients}
                    />
                    <Statistic
                      title="Bitrate In"
                      value={formatBitPerSec(stream.bwIn)}
                    />
                    <br />
                    <Collapse>
                      <Collapse.Panel key="1" header="Stats">
                        {JSON.stringify(stream)}
                      </Collapse.Panel>
                    </Collapse>
                  </Card>
                ));
                return (
                  <div className="Stream-Application" key={i}>
                    <Typography.Title level={3}>{e.name}</Typography.Title>
                    <div className="Stream-Cards">{res}</div>
                    <br />
                  </div>
                );
              }
            )}

            <div className="Stream-Application">
              <Typography.Title level={3}>SRT</Typography.Title>
              <div className="Stream-Cards">
                {ServerStatus.data.StreamAppsUpdate.srt.map(
                  (stream: any, i: number) => (
                    <Card className="Stream-Card" key={i}>
                      {/*<small>{`${stream.meta.video.width}x${stream.meta.video.height} ${stream.meta.video.framerate}p`}</small>*/}
                      <Typography.Title
                        level={3}
                        copyable={{
                          text: `srt://${process.env.REACT_APP_SRT}/?${
                            stream.url.split("?")[1]
                          }`,
                        }}
                      >
                        {stream.name}
                      </Typography.Title>
                      <small>
                        {stream.alias ? `Key: ${stream.name}` : "No alias"}
                      </small>
                      <Statistic
                        title="Created"
                        value={ConvertMinutes(
                          new Date().valueOf() -
                            new Date(stream.created).valueOf()
                        )}
                      />
                      <Statistic
                        title="Connected Devices"
                        value={stream.clients}
                      />
                      <br />
                      <Collapse>
                        <Collapse.Panel key="1" header="Stats">
                          {JSON.stringify(stream)}
                        </Collapse.Panel>
                      </Collapse>
                    </Card>
                  )
                )}
              </div>
              <br />
            </div>
          </>
        )}
      </>
    );
  }

  return (
    <div className="App">
      <div className="App-Content">
        <Typography.Title level={2}>Stats</Typography.Title>
        {ListStats()}
      </div>
    </div>
  );
}

export default Stats;
