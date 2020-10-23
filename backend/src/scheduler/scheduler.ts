import { Linkedlist, INode } from '../datastructures/linkedlist'
import { PlaylistMetaData, TrackMetaData } from '../scheduler/job'
import { Job } from './job'
import { PlaylistBody } from '../types/types'
import { connector } from '../connector/Connector'
import { Track } from '@sonos-inc/pdsw-muse-control-api'
import { play } from '../controllers/playListController'
import { time } from 'console'

export class Scheduler {
    private jobs: Linkedlist<Job>
    private currentJob: INode<Job> | undefined
    private references: string[]
    private static instance: Scheduler

    private constructor() {
        this.jobs = new Linkedlist<Job>()
        this.currentJob = undefined
        this.references = []
    }

    public static getInstance(): Scheduler {
        if (!Scheduler.instance) {
            Scheduler.instance = new Scheduler()
        }

        return Scheduler.instance
    }

    public addPlaylist(data: PlaylistBody) {

        const playlistMeta: PlaylistMetaData = {
            playlistId: data.playlistId,
            serviceId: '12',
            name: data.name,
            type: 'playlist',
            objectId: data.objectId
        }
        
        const newJob = new Job(data.playlistId, 0, 0, data.volume, playlistMeta, data.weight)

        this.jobs.append(newJob)

        for (let i = 0; i < newJob.weight; i++) {
            this.references.push(newJob.jobId)
        }

        if (this.currentJob === undefined) {
            this.currentJob = this.jobs.getHead()
        }

        console.debug('List of jobs:')
        console.debug(this.jobs.toArray())
    }

    public getCurrentPlaylist(): Job {
        if (this.currentJob) {
            return this.currentJob.value
        }
        else {
            throw new Error('Cannot access current job when there is not one yet!')
        }
    }

    public async contextSwitch(): Promise<boolean> {
        if (this.currentJob) {
            try {
                const playbackData = await this.getPlaybackData()
                const volumeData = await this.getVolumeData()

                const track: TrackMetaData = {
                    type: playbackData.type,
                    name: playbackData.name,
                    album: playbackData.name,
                    artist: playbackData.artist,
                    serviceId: playbackData.serviceId,
                    objectId: playbackData.objectId,
                    imageUrl: playbackData.imageUrl,
                    durationMillis: playbackData.durationMillis
                }

                this.currentJob.value.positionMillis = playbackData.positionMillis
                this.currentJob.value.previousPositionMillis = playbackData.previousPositionMillis
                this.currentJob.value.volume = volumeData.volume
                this.currentJob.value.trackMetaData = track

                console.debug('Job data being saved from context switch:')
                console.debug(this.currentJob)
                return true
            }
            catch (e) {
                console.log(`An error fetching playback and volume data occurred because of ${e}`)
                return false
            }
        }

        return false
    }

    public async getPlaybackData(): Promise<any> {
        return new Promise((resolve, reject) => {
            if (connector.getDevice()?.connected) {
                connector.getDevice()?.playbackExtended.getExtendedPlaybackStatus((res) => {
                    const trackMetaSave: any = {
                        type: '',
                        name: '',
                        album: '',
                        artist: '',
                        serviceId: '',
                        objectId: '',
                        imageUrl: '',
                        durationMillis: 0,
                        positionMillis: 0,
                        previousPositionMillis: 0,
                    }
    
                    if (res[1]) {
                        trackMetaSave.type = res[1].metadata.currentItem.track.type
                        trackMetaSave.name = res[1].metadata.currentItem.track.name
                        trackMetaSave.imageUrl = res[1].metadata.currentItem.track.imageUrl
                        trackMetaSave.album = res[1].metadata.currentItem.track.album.name
                        trackMetaSave.artist = res[1].metadata.currentItem.track.artist.name
                        trackMetaSave.serviceId = res[1].metadata.currentItem.track.id.serviceId
                        trackMetaSave.objectId = res[1].metadata.currentItem.track.id.objectId
                        trackMetaSave.durationMillis = res[1].metadata.currentItem.track.durationMillis
                        
                        trackMetaSave.positionMillis = res[1].playback.positionMillis
                        trackMetaSave.previousPositionMillis = res[1].playback.previousPositionMillis
    
                        return resolve(trackMetaSave)
                    }
                })
            }
            else {
                return reject(undefined)
            }
        })
    }

    public async getVolumeData(): Promise<any> {
        return new Promise((resolve, reject) => {
            connector.getDevice()?.playerVolume.getVolume((res) => {
                let timeAndVolumeData: any = {
                    volume: 0,
                }

                if (res[1]) {
                    timeAndVolumeData.volume = res[1].volume
                    resolve(timeAndVolumeData)
                }
            })
        })
    }

    public async getCurrentPositionMillis(): Promise<any> {
        return new Promise((resolve, reject) => {
            connector.getDevice()?.playback.getPlaybackStatus((res) => {
                let currentPositionMillis = {
                    positionMillis: 0,
                    previousPositionMillis: 0,
                }

                if (res[1]) {
                    currentPositionMillis.positionMillis = res[1].positionMillis
                    currentPositionMillis.previousPositionMillis = res[1].previousPositionMillis
                    resolve(currentPositionMillis)
                }
            })
        })
    }

    public async getCurrentTrack(): Promise<any> {
        return new Promise((resolve, reject) => {
            connector.getDevice()?.playbackExtended.getExtendedPlaybackStatus((res) => {
                const trackMetaSave: any = {
                    type: '',
                    name: '',
                    album: '',
                    artist: '',
                    serviceId: '',
                    objectId: '',
                    imageUrl: '',
                    durationMillis: 0,
                }

                if (res[1]) {
                    trackMetaSave.type = res[1].metadata.currentItem.track.type
                    trackMetaSave.name = res[1].metadata.currentItem.track.name
                    trackMetaSave.imageUrl = res[1].metadata.currentItem.track.imageUrl
                    trackMetaSave.album = res[1].metadata.currentItem.track.album.name
                    trackMetaSave.artist = res[1].metadata.currentItem.track.artist.name
                    trackMetaSave.serviceId = res[1].metadata.currentItem.track.id.serviceId
                    trackMetaSave.objectId = res[1].metadata.currentItem.track.id.objectId
                    trackMetaSave.durationMillis = res[1].metadata.currentItem.track.durationMillis
                    
                    return resolve(trackMetaSave)
                }
            })
        })
    }

    public async roundRobin() {
        if (this.currentJob) {
            const contextSwitchBool = await this.contextSwitch()
            if (contextSwitchBool) {
                if (this.currentJob.next) {
                    this.currentJob = this.currentJob.next
                }
                else {
                    this.currentJob = this.jobs.getHead()
                }
            }
            else {
                throw new Error('Failed to context switch, stopped switching playlists')
            }
        }
        else {
            throw new Error('Cannot access current job when there is not one yet!')
        }
    }

    public async weightedRoundRobin() {
        if (this.currentJob) {
            const contextSwitchBool = await this.contextSwitch()
            if (contextSwitchBool) {
                this.currentJob = this.pickNextJobWRR()
                if (!this.currentJob) {
                    throw new Error('Was not able to find the next node')
                }
            }
            else {
                throw new Error('Failed to context switch, stopped switching playlists')
            }
        }
        else {
            throw new Error('Cannot access current job when there is not one yet!')
        }
    }

    private pickNextJobWRR(): INode<Job> | undefined {
        const nextJobIndex = this.getRandomIndex(this.references.length)
        const nextJobId = this.references[nextJobIndex]
        let node = this.jobs.getHead()

        while (node) {
            if (node.value.jobId === nextJobId) {
                return node
            }
            node = node.next
        }

        return undefined
    }

    private getRandomIndex(num): number {
        return Math.floor(Math.random() * Math.floor(num));
    }
}