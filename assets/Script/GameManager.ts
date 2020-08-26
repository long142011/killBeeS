// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Random, NodeHelper } from "./Helper";
import Enemy from "./Enemy";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameManager extends cc.Component {

    public static get Instance(): GameManager { return this._instance; }
    private static _instance: GameManager = null;

    @property
    col: number = 0;
    @property
    row: number = 0;
    countDestroy: number = 0;
    @property(cc.Prefab)
    enemyPrefab: cc.Prefab = null;
    @property(cc.Prefab)
    playerBulletPrefab: cc.Prefab = null;
    @property(cc.Prefab)
    enemyBulletPrefab: cc.Prefab = null;
  
    playerBulletPool: cc.NodePool = null;
    enemyBulletPool: cc.NodePool = null;
    enemyFirerate: number = 0;
    enemyBulletSpeed: number = 100;
    pause: boolean = false;
    listEnemy: cc.Node[] = [];
    @property
    liveRemain: number = 3;

    @property([cc.Node])
    liveVisual: cc.Node[] = [];

    @property(cc.Node)
    player: cc.Node = null;

    @property
    scoreValue: number = 0;
    @property(cc.Label)
    scoreVisual: cc.Label = null;
    @property
    timeValue: number = 0;
    @property(cc.Label)
    timeVisual: cc.Label = null;
    @property
    levelValue: number = 1;
    @property(cc.Label)
    levelVisual: cc.Label = null;
    onLoad() {
        if (this.isSingletonExist())
            return;

        cc.director.getPhysicsManager().enabled = true;      

        this.playerBulletPool = new cc.NodePool();
        let initCountPlayerBullet = 100;
        for (let i = 0; i < initCountPlayerBullet; ++i) {
            let playerBullet = cc.instantiate(this.playerBulletPrefab);
            this.playerBulletPool.put(playerBullet);
        }

        this.enemyBulletPool = new cc.NodePool();
        let initCountEnemyBullet = 100;
        for (let i = 0; i < initCountEnemyBullet; ++i) {
            let enemyBullet = cc.instantiate(this.enemyBulletPrefab);
            this.enemyBulletPool.put(enemyBullet);
        }
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    }
    lose(){
        this.pause = false;
        this.timeValue = 61;
        this.scoreValue = 0;
        this.liveRemain = 3;
        this.levelValue = 0;
        this.countDestroy = 0;
        this.player.active = true;
        this.rate = 1;
        this.enemyBulletSpeed = 100;
        this.player.getComponent(cc.Animation).play("Idle");
        this.player.getComponent(cc.Collider).enabled = true;
        this.listEnemy.forEach(element => {
            let elementC = element.getComponent(Enemy);
            element.active = true;
            element.getComponent(cc.Animation).play("Idle");
            element.getComponent(cc.Collider).enabled = true;
            element.position = cc.v3(elementC.startX,element.position.y,0);
            elementC.direction = false;
            elementC.speed = 30;
        });
        
    }
    win(){
        this.pause = false;
        this.levelValue += 1;
        if(this.levelValue < 7){
            this.timeValue = 61 - 5 * this.levelValue;
            this.rate = 1 - 0.2 * this.levelValue;
        }
        
        this.countDestroy = 0;
        this.enemyBulletSpeed = 100 + 10 * this.levelValue;
        this.listEnemy.forEach(element => {
            let elementC = element.getComponent(Enemy);
            element.active = true;
            element.getComponent(cc.Animation).play("Idle");
            element.getComponent(cc.Collider).enabled = true;
            element.position = cc.v3(elementC.startX,element.position.y,0);
            elementC.direction = false;
            elementC.speed = 30 + 2 * this.levelValue;
        });
        
    }
    onKeyDown(event) {
        switch (event.keyCode) {
            case cc.macro.KEY.enter:
                this.lose();
                break;
        }
    }

    getPlayerBullet(parentNode): cc.Node {
        let playerBullet = null;
        if (this.playerBulletPool.size() > 0) {
            playerBullet = this.playerBulletPool.get();
        } else {
            playerBullet = cc.instantiate(this.playerBulletPrefab);
        }
        playerBullet.parent = parentNode;
        return playerBullet;
    }
    getEnemyBullet(parentNode): cc.Node {
        let enemyBullet = null;
        if (this.enemyBulletPool.size() > 0) {
            enemyBullet = this.enemyBulletPool.get();
        } else {
            enemyBullet = cc.instantiate(this.enemyBulletPrefab);
        }
        enemyBullet.parent = parentNode;
        return enemyBullet;
    }

    start() {
        let x = 150;
        let y = 550;
        var scene = cc.director.getScene();
        for (let r = 0; r < this.row; r++) {
            for (let c = 0; c < this.col; c++) {
                let enemy = cc.instantiate(this.enemyPrefab);
                this.listEnemy.push(enemy);
                enemy.parent = scene;
                enemy.position = cc.v3(x, y, 0);
                enemy.active = true;
                x += 500 / (this.col - 1);
            }
            x = 150;
            y -= 50;
        }
    }
    rate: number = 1;
    update (dt) {
        if (this.enemyFirerate > 0) {
            this.enemyFirerate -= dt;
        } else {
            this.enemyFirerate = this.rate;
            let aliveEnemy = this.listEnemy.filter(p=>p.activeInHierarchy === true);
            aliveEnemy[Random.Range(0,aliveEnemy.length - 1)].getComponent(Enemy).fire();
        }

        for (let index = 0; index < 3; index++) {
            if(index < this.liveRemain){
                this.liveVisual[index].active = true;
            }else{
                this.liveVisual[index].active = false;
            }        
        }

        this.scoreVisual.string = this.scoreValue.toString();
        
        if(!this.pause){
            if(this.timeValue > 0){
                this.timeValue -= dt;
            } else {
                this.timeValue = 0;
                this.player.getComponent(cc.Collider).enabled = false;
                this.player.getComponent(cc.Animation).play("Explode");              
                this.pause = true;
            }
        }
        this.timeVisual.string = Math.floor(this.timeValue).toString();
        this.levelVisual.string = this.levelValue.toString();
    }


    private isSingletonExist(): boolean {
        if (GameManager._instance == null) {
            GameManager._instance = this;
            return false;
        }
        else {
            this.destroy();
            return true
        }
    }
    public releaseSingleton() {
        GameManager._instance = null;
    }
}
