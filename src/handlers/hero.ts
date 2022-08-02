import { Gender, HeroBasicType } from "../../resources/autogenerated/common.define";
import { Avatar, GetAvatarDataCsReq, GetAvatarDataScRsp } from "../../resources/autogenerated/cs.avatar";
import { ChangeLineupLeaderCsReq, ChangeLineupLeaderScRsp, GetAllLineupDataCsReq, GetAllLineupDataScRsp, LineupAvatar, LineupInfo } from "../../resources/autogenerated/cs.lineup";
import { GetHeroBasicTypeInfoCsReq, GetHeroBasicTypeInfoScRsp, GetHeroPathCsReq, GetHeroPathScRsp, HeroBasicTypeInfo } from "../../resources/autogenerated/cs.player";
import { PlayerManager } from "../game/players";
import { PacketContext, RouteManager } from "../network/route";

export class HeroHandler {
    constructor(routeManager: RouteManager) {
        routeManager.on(GetHeroBasicTypeInfoCsReq, this.GetHeroBasicTypeInfoCsReq);
        routeManager.on(GetHeroPathCsReq, this.GetHeroPathCsReq);
        routeManager.on(GetAvatarDataCsReq, this.GetAvatarDataCsReq);
        routeManager.on(GetAllLineupDataCsReq, this.GetAllLineupDataCsReq);
        routeManager.on(ChangeLineupLeaderCsReq, this.ChangeLineupLeaderCsReq);
    }

    public ChangeLineupLeaderCsReq(context: PacketContext<ChangeLineupLeaderCsReq>) {
        const rsp = ChangeLineupLeaderScRsp.create();
        rsp.retcode = 0;
        rsp.slot = context.request.slot!;
        context.send(ChangeLineupLeaderScRsp, rsp);
    }

    public GetAllLineupDataCsReq(context: PacketContext<GetAllLineupDataCsReq>) {
        const rsp = GetAllLineupDataScRsp.create();
        rsp.retcode = 0;
        rsp.lineupList = context.player!.lineups.map(lineup => lineup.toLineupInfo());
        context.send(GetAllLineupDataScRsp, rsp);
    }

    public GetAvatarDataCsReq(context: PacketContext<GetAvatarDataCsReq>) {
        const player = PlayerManager.players.get(1)!;
        const rsp = GetAvatarDataScRsp.create();
        rsp.avatarList = player.avatars;
        rsp.retcode = 0;
        rsp.isAll = context.request.isGetAll!;
        context.send(GetAvatarDataScRsp, rsp);
    }

    public GetHeroPathCsReq(context: PacketContext<GetHeroPathCsReq>) {
        const rsp = GetHeroPathScRsp.create();
        rsp.retcode = 0;
        rsp.heroPathList = [];
        context.send(GetHeroPathScRsp, rsp);
    }

    public GetHeroBasicTypeInfoCsReq(context: PacketContext<GetHeroBasicTypeInfoCsReq>) {
        const rsp = GetHeroBasicTypeInfoScRsp.create();
        rsp.retcode = 0;
        rsp.gender = Gender.GenderMan;
        rsp.isPlayerInfoModified = true;
        rsp.isGenderModified = true;
        rsp.heroPathList = [];
        rsp.curBasicType = HeroBasicType.BoyKnight;
        rsp.basicTypeInfoList = [
            HeroBasicTypeInfo.create({
                basicType: HeroBasicType.BoyKnight,
                rank: 1,
                skillTreeList: []
            })
        ];
        context.send(GetHeroBasicTypeInfoScRsp, rsp);
    }
}