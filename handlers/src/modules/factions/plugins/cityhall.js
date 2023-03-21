import methods from '../../methods';
import user from '../../../user';
import npc from "../../../manager/npc";
import UIMenu from '../../menu';
import config from "../config";

let plugin = {};

//#region Ініціалізація фракції.
plugin.loadCityHall = () => {
    Peds();
    Events();
}
//#endregion
//#region Створення Peds.
function Peds() {
    try {
        config.cityhall.peds.forEach(json => {
            npc.create(mp.game.joaat(json[0]), new mp.Vector3(json[1], json[2], json[3]), json[4], json[5], json[6]);
        });
    } catch (error) {
        mp.game.ui.notifications.show(`~r~Произошла неизвестная ошибка`);
        // Потрібно зробити утиліту запису помилки у файл.
        methods.debug('[factions::cityhall:peds]', error);
    }
}
//#endregion
//#region Меню службового транспорту.
function showMenuParkings(data) {
    UIMenu.Menu.Create(`Транспорт`, `~b~Транспорт организации`);
    data.forEach(function (item) {
        if (item.rank < 0) {
            UIMenu.Menu.AddMenuItem(`~c~${item.name}: ~s~`, `Транспорт не доступен`, {}, `${item.number + item.id}`);
            return;
        }
        if (item.rank >= user.getCache('rank') || user.isLeader() || user.isSubLeader()) {
            let menuItem = {};
            menuItem.vehicleId = item.id;
            menuItem.vName = item.name;
            UIMenu.Menu.AddMenuItem(`~b~${item.name}: ~s~`, "Нажмите \"~g~Enter~s~\" чтобы взять транспорт", menuItem, `${item.number}`);
        } else {
            UIMenu.Menu.AddMenuItem(`~c~${item.name}: ~s~`, `Транспорт не доступен`, {}, `${item.number + item.id}`);
        }
    });
    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", { doName: "closeMenu" });
    UIMenu.Menu.Draw();
    UIMenu.Menu.OnSelect.Add((item, index) => {
        UIMenu.Menu.HideMenu();
        if (item.vehicleId != undefined) {
            mp.events.callRemote('server:vehicle:spawnFractionCar', item.vehicleId);
        }
    });
}
//#endregion
//#region Виклик події
function Events() {
    // Меню службового транспорту.
    mp.events.add('wixcore::security::module::factions:cityhall:menu:list:parkings', (data) => {
        try {
            showMenuParkings(data);
        } catch (error) {
            mp.game.ui.notifications.show(`~r~Произошла неизвестная ошибка`);
            // Потрібно зробити утиліту запису помилки у файл.
            methods.debug('[wixcore::security::module::factions:cityhall:menu:list:parkings]', error);
        }
    });
}
//#endregion

export default plugin;