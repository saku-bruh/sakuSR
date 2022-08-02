import { AvatarType, PlayerBasicInfo } from "../../resources/autogenerated/common.define";
import { Avatar } from "../../resources/autogenerated/cs.avatar";
import { LineupAvatar, LineupInfo } from "../../resources/autogenerated/cs.lineup";
import { Client } from "../network/client";
import { Logger } from "../utils/log";

export class PlayerManager {
    static players: Map<number, Player> = new Map<number, Player>();
}

export class Player {

    constructor(readonly session: Client, public basicInfo: PlayerBasicInfo, public avatars: Avatar[], public lineups: Lineup[]) {
    }
}
export class Lineup {
    constructor(readonly player: Player, public name: string, public avatarList: number[], public leaderSlot: number, public index: number, public isVirtual: boolean) {
        if(avatarList.length > 4){
            Logger.error("Lineup can't have more than 4 avatars. Slicing");
            this.avatarList = this.avatarList.slice(0, 3);
        }
    }

    public toLineupInfo(): LineupInfo {
        let slot = 0;
        const lineupInfo = LineupInfo.create();
        lineupInfo.name = this.name;
        lineupInfo.avatarList = this.avatarList.map(avatarId => {
            const avatar = this.player.avatars.find(avatar => avatar.baseAvatarId === avatarId);
            const lineupAvatar = LineupAvatar.create();
            lineupAvatar.avatarType = AvatarType.AVATAR_FORMAL_TYPE;
            lineupAvatar.id = avatar!.baseAvatarId;
            lineupAvatar.hp = 100000;
            lineupAvatar.sp = 100000;
            lineupAvatar.satiety = 10;
            lineupAvatar.slot = slot++;
            return lineupAvatar;
        });
        lineupInfo.leaderSlot = this.leaderSlot;
        lineupInfo.index = this.index;
        lineupInfo.isVirtual = this.isVirtual;
        return lineupInfo;
    }
}