"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pdsw_muse_control_api_1 = require("@sonos-inc/pdsw-muse-control-api");
const Device_1 = require("@sonos-inc/pdsw-muse-control-api/dist/models/Device");
const system = new pdsw_muse_control_api_1.SystemDiscoverer();
// const allDevices: Device[] = []
// system.on(SystemEvent.DEVICES_CHANGED, (devices) => {
//     devices.forEach((device: Device) => {
//         device.on(DeviceEvent.CONNECTED, () => {
//             allDevices.push(device)
//             // device.playback.loadContainer({
//             //   containerId: { objectId: 'spotify:user:spotify:playlist:37i9dQZF1DX4WYpdgoIcn6', serviceId: '12' },
//             //   containerMetadata: { name: 'Chill Hits', type: 'playlist', id: { objectId: 'playlist:37i9dQZF1DX4WYpdgoIcn6', serviceId: '12' } },
//             //   playOnCompletion: false,
//             // }).then((value) => {
//             //     console.log(value)
//             // }).catch((e) => {
//             //     console.log(`ERROR has occured due to ${e}`)
//             // })
//         })
//         device.connect()
//     });
// })
// system.on(SystemEvent.GROUPS_CHANGED, (groups: Group[]) => {
//     groups.forEach((group: Group) => {
//         if (group.name === 'Bedroom 2 + 1') {
//             // const groupCoordinatorId = group.coordinatorId
//             const groupCoordinatorId = 'RINCON_949F3EC5E6F201400'
//             console.log(system.devices)
//             const groupCoordinator = system.devices.filter((device) => device.id === groupCoordinatorId)[0]
//             console.log(groupCoordinator)
//             console.log(groupCoordinatorId)
//             groupCoordinator.playback.loadContainer({
//                   containerId: { objectId: 'spotify:user:spotify:playlist:37i9dQZF1DX4WYpdgoIcn6', serviceId: '12' },
//                   containerMetadata: { name: 'Chill Hits', type: 'playlist', id: { objectId: 'playlist:37i9dQZF1DX4WYpdgoIcn6', serviceId: '12' } },
//                   playOnCompletion: false,
//             }).then((value) => {
//                 console.log(value)
//             }).catch((e) => {
//                 console.log("ERRROR")
//                 console.log(e)
//             })
//         }
//     })
// })
// system.start();
function initSystemDiscoverer() {
    system.start();
    return new Promise((resolve, reject) => {
        system.on(pdsw_muse_control_api_1.SystemEvent.DEVICES_CHANGED, (devices) => {
            devices.forEach((device) => {
                if (device.name === 'Bedroom 2') {
                    device.on(Device_1.DeviceEvent.CONNECTED, () => {
                        resolve("Device Has Connected");
                        // device.playback.loadContainer({
                        //   containerId: { objectId: 'spotify:user:spotify:playlist:37i9dQZF1DX4WYpdgoIcn6', serviceId: '12' },
                        //   containerMetadata: { name: 'Chill Hits', type: 'playlist', id: { objectId: 'playlist:37i9dQZF1DX4WYpdgoIcn6', serviceId: '12' } },
                        //   playOnCompletion: false,
                        // }).then((value) => {
                        //     console.log(value)
                        // }).catch((e) => {
                        //     console.log(`ERROR has occured due to ${e}`)
                        // })
                    });
                    device.connect();
                }
            });
        });
    });
}
initSystemDiscoverer().then((val) => {
    console.log(val);
});
