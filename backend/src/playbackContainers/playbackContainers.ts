import { MethodTypes } from '@sonos-inc/pdsw-muse-control-api'
import { PlaybackLoadContainerBody } from '@sonos-inc/pdsw-muse-control-api'

export const chillSpotifyPlaylist: PlaybackLoadContainerBody = {
    containerId: { objectId: 'spotify:user:spotify:playlist:37i9dQZF1DX4WYpdgoIcn6', serviceId: '12' },
    containerMetadata: { name: 'Chill Hits', type: 'playlist', id: { objectId: 'playlist:37i9dQZF1DX4WYpdgoIcn6', serviceId: '12' } },
    playOnCompletion: true,
}

export const brockHamptonSpotifyPlaylist: PlaybackLoadContainerBody = {
    containerId: { objectId: 'spotify:playlist:3ceft2Vhq4WMSS6B5CPkPK', serviceId: '12' },
    containerMetadata: { name: 'Brockhampton best', type: 'playlist', id: { objectId: 'playlist:3ceft2Vhq4WMSS6B5CPkPK', serviceId: '12' } },
    playOnCompletion: true,
}

export const avalanchesSpotifyPlaylist: PlaybackLoadContainerBody = {
    containerId: { objectId: 'spotify:playlist:6kze61gU8noRTVaKuokmNq', serviceId: '12' },
    containerMetadata: { name: 'The Avalanches Playlist', type: 'playlist', id: { objectId: 'playlist:6kze61gU8noRTVaKuokmNq', serviceId: '12' } },
    playOnCompletion: true,
}

const outputCommand = {
    header: {
        "namespace": "playback",
        "command": "loadContainer",
        "groupId": "RINCON_7828CAE1557A01400:697346672",
        "householdId": "Sonos_fpP2IzMeC9r7CzkcE5fMJfpBFw.CsQ1ykQ3YxZO31DiQo_O"
    },
    body: {
        "containerId": {
        "objectId": "spotify:user:spotify:playlist:37i9dQZF1DX4WYpdgoIcn6",
        "serviceId": "12"
        },
        "containerMetadata": {
        "name": "Chill Hits",
        "type": "playlist",
        "id": {
            "objectId": "playlist:37i9dQZF1DX4WYpdgoIcn6",
            "serviceId": "12"
        }
        },
        "playOnCompletion": "false"
    },
    method: MethodTypes.POST,
    localPath: '',
}
