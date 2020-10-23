import { playback, PlaybackLoadContainerBody, PlaybackLoadTrackListBody, PlaybackSeekBody, SystemDiscoverer, SystemEvent} from '@sonos-inc/pdsw-muse-control-api'
import Group from '@sonos-inc/pdsw-muse-control-api/dist/models/Group'
import Device, { DeviceEvent } from '@sonos-inc/pdsw-muse-control-api/dist/models/Device'
import { Scheduler } from '../scheduler/scheduler'
import { Job, TrackMetaData } from '../scheduler/job'

const HARDCODED_DEVICE = 'Bedroom 3'

class Connector {
    private system: SystemDiscoverer
    private targetDevice?: Device

    constructor() {
        this.system = new SystemDiscoverer()
        this.targetDevice = undefined
    }

    async init(): Promise<boolean> {
        if (this.targetDevice === undefined) {
            return new Promise((resolve, reject) => {
                this.system.on(SystemEvent.DEVICES_CHANGED, (devices) => {
                    devices.forEach((device: Device) => {
                        if (device.name === HARDCODED_DEVICE) {
                            device.on(DeviceEvent.CONNECTED, () => {
                                this.targetDevice = device
                                resolve(true)
                            })
                            device.on(DeviceEvent.CONNECTFAIL, () => {
                                this.targetDevice = undefined
                                reject(false)
                            })
                            device.connect()
                        }
                    });
                })
                this.system.start()
            })
        }
        else {
            
            return Promise.resolve(true)
        }
    }

    async loadContainer(job: Job, firstLoad: boolean): Promise<any> {
        if (this.targetDevice === undefined) {
            let success = await this.init()
            if (!success) {
                return Promise.reject(success)
            }
        }

        if (job) {
            const playlistData: PlaybackLoadContainerBody = {
                containerId: {
                    objectId: job.playlistMetaData.objectId,
                    serviceId: job.playlistMetaData.serviceId
                },
                containerMetadata: {
                    name: job.playlistMetaData.name,
                    type: job.playlistMetaData.type,
                    id: {
                        objectId: job.playlistMetaData.objectId,
                        serviceId: job.playlistMetaData.serviceId
                    }
                },
                playOnCompletion: false
            }

            if (job.trackMetaData) {
                await this.targetDevice?.playback.loadContainer(playlistData)
                this.targetDevice?.playbackExtended.subscribe(async (val) => {
                    if (val[1] && val[1].metadata) {
                        if (val[1].metadata.container.id.objectId === job.playlistMetaData.objectId) {
                            if (val[1].metadata.currentItem) {
                                if (val[1].metadata.currentItem.track.name !== job.trackMetaData?.name) {
                                    console.log(val[1].metadata.currentItem.track.name)
                                    console.log(val[1].metadata.currentItem.track.id.objectId)
                                    await this.skip()
                                }
                                else {
                                    console.log(val[1].metadata.currentItem.track.name)
                                    console.log(val[1].metadata.currentItem.track.id.objectId)
                                    await this.seek(job.positionMillis)
                                    this.targetDevice?.playbackExtended.unsubscribe(() => {
                                        console.log("Unsubscribed!")
                                    })
                                }
                            }
                        }
                    }
                })

            }
            else {
                try {
                    await this.targetDevice?.playback.loadContainer(playlistData)

                    if (firstLoad) {
                        this.targetDevice?.playbackMetadata.subscribe((val) => {
                            if (val === true) {
                                console.log("HERE RETRYING LOAD CONTAINER 1")
                                setTimeout(async () => {
                                    await this.targetDevice?.playback.loadContainer(playlistData)
                                    this.targetDevice?.playbackMetadata.unsubscribe((val) => {
                                        console.log("Unsubscribed!")
                                    })
                                   
                                }, 1000)
                            }
                        })
                    }

                    return Promise.resolve(true)
                }
                catch (e) {
                    console.log(`Error occured due to ${e}`)
                    return Promise.reject(false)
                }
            }
        }
        else {
            return Promise.reject(false)
        }
    }

    async switchPlaylists(WRR: boolean): Promise<boolean> {
        if (this.targetDevice === undefined) {
            let success = await this.init()
            if (!success) {
                return Promise.reject(success)
            }
        }

        if (!WRR) {
            try {
                console.debug('Using Round Robin Scheduling...')
                await Scheduler.getInstance().roundRobin()
    
                console.debug('Current Playlist is now:')
                console.debug(Scheduler.getInstance().getCurrentPlaylist())
    
                try {
                    await this.loadContainer(Scheduler.getInstance().getCurrentPlaylist(), false)
    
                    return Promise.resolve(true)
                }
                catch (e) {
                    console.log(`Error occured due to ${e}`)
                    return Promise.reject(false)
                }
    
            }
            catch (e) {
                console.log(`Couldn't switch playlists because of ${e}`)
                return Promise.reject(false)
            }
        }
        else {
            let tempCurrentJobId = Scheduler.getInstance().getCurrentPlaylist().jobId
            try {
                console.debug('Using Weighted Round Robin Scheduling...')
                await Scheduler.getInstance().weightedRoundRobin()
    
                console.debug('Current Playlist is now:')
                console.debug(Scheduler.getInstance().getCurrentPlaylist())
                try {
                    if (tempCurrentJobId === Scheduler.getInstance().getCurrentPlaylist().jobId) {
                        await this.skip()
                    } 
                    else {
                        await this.loadContainer(Scheduler.getInstance().getCurrentPlaylist(), false)
                    }
                    return Promise.resolve(true)
                }
                catch (e) {
                    console.log(`Error occured due to ${e}`)
                    return Promise.reject(false)
                }
    
            }
            catch (e) {
                console.log(`Couldn't switch playlists because of ${e}`)
                return Promise.reject(false)
            }
        }
    }

    async getInfo(): Promise<any> {
        if (this.targetDevice === undefined) {
            let success = await this.init()
            if (!success) {
                return Promise.reject(success)
            }
        }
        try {
            await this.targetDevice?.playback.getPlaybackStatus((response: any) => {
                // console.log(response)
            })
            return Promise.resolve(true)
        }
        catch (e) {
            console.log(`Error occured due to ${e}`)
            return Promise.reject(false)
        }
    }

    async seek(positionMillis: number) {
        if (this.targetDevice === undefined) {
            let success = await this.init()
            if (!success) {
                return Promise.reject(success)
            }
        }

        const seekData: PlaybackSeekBody = {
            positionMillis: positionMillis
        }

        try {
            await this.targetDevice?.playback.seek(seekData, (res: any) => {
                console.log(res)
            })
            return Promise.resolve(true)
        }
        catch (e) {
            console.log(`Error occurred due to ${e}`)
            return Promise.reject(false)
        }
    }

    async play(): Promise<boolean> {
        if (this.targetDevice === undefined) {
            let success = await this.init()
            if (!success) {
                return Promise.reject(success)
            }
        }

        try {
            const timeData = await Scheduler.getInstance().getCurrentPositionMillis()
            Scheduler.getInstance().getCurrentPlaylist().positionMillis = timeData.positionMillis
            Scheduler.getInstance().getCurrentPlaylist().previousPositionMillis = timeData.previousPositionMillis
        }
        catch (e) {
            console.log(`Failed to get playback status, Error occurred due to ${e}`)
            return Promise.reject(false)
        }

        try {
            const seekData: PlaybackSeekBody = {
                positionMillis: Scheduler.getInstance().getCurrentPlaylist().positionMillis,
            }
            await this.targetDevice?.playback.seek(seekData)
            await this.targetDevice?.playback.togglePlayPause()

            return Promise.resolve(true)
        }
        catch (e) {
            console.log(`Error occurred due to ${e}`)
            return Promise.reject(false)
        }
    }

    async pause(): Promise<boolean> {
        if (this.targetDevice === undefined) {
            let success = await this.init()
            if (!success) {
                return Promise.reject(success)
            }
        }

        try {
            const timeData = await Scheduler.getInstance().getCurrentPositionMillis()
            Scheduler.getInstance().getCurrentPlaylist().positionMillis = timeData.positionMillis
            Scheduler.getInstance().getCurrentPlaylist().previousPositionMillis = timeData.previousPositionMillis
        }
        catch (e) {
            console.log(`Failed to get playback status, Error occurred due to ${e}`)
            return Promise.reject(false)
        }

        try {
            const seekData: PlaybackSeekBody = {
                positionMillis: Scheduler.getInstance().getCurrentPlaylist().positionMillis,
            }
            await this.targetDevice?.playback.seek(seekData)
            await this.targetDevice?.playback.togglePlayPause()

            return Promise.resolve(true)
        }
        catch (e) {
            console.log(`Error occurred due to ${e}`)
            return Promise.reject(false)
        }
    }

    async skip(): Promise<boolean> {
        if (this.targetDevice === undefined) {
            let success = await this.init()
            if (!success) {
                return Promise.reject(success)
            }
        }

        try {
            await this.targetDevice?.playback.skipToNextTrack()
            return true
        }
        catch (e) {
            console.log(`Skipping track failed due to ${e}`)
            return Promise.reject(false)
        }
    }

    getDevice() {
        if (this.targetDevice) {
            return this.targetDevice
        }

        return undefined
    }
}

export const connector = new Connector()