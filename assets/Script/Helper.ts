/**
 * @version 1.0.5
 */

export class Random
{
    public static Range(min: number, max: number)
    {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    public static RandomVector2(min: cc.Vec2, max: cc.Vec2): cc.Vec2
    {
        let x = Random.Range(min.x, max.x);
        let y = Random.Range(min.y, max.y);
        return new cc.Vec2(x, y);
    }
}

export class Mathf
{
    public static Clamp01(value: number)
    {
        return Math.min(Math.max(value, 0), 1);
    }

    public static Clamp(value: number, min : number, max: number)
    {
        return Math.min(Math.max(value, min), max);
    }
}

export class NodeHelper
{
    public static Show(node: cc.Node)
    {
        if (!node.active)
            node.active = true;

        if (node.opacity != 255)
            node.opacity = 255;

        if (node.color != cc.Color.WHITE)
            node.color = cc.Color.WHITE;
    }

    public static Shows(nodes: cc.Node[])
    {
        nodes.forEach(x => this.Show(x));
    }

    public static Hide(node: cc.Node)
    {
        if (node.active)
            node.active = false;

        if (node.opacity != 0)
            node.opacity = 0;
    }

    public static Hides(nodes: cc.Node[])
    {
        nodes.forEach(x => this.Hide(x));
    }

    public static SetActive(node: cc.Node, enable: boolean)
    {
        if (enable)
            this.Show(node);
        else
            this.Hide(node);
    }

    public static SetActives(nodes: cc.Node[], enable: boolean)
    {
        for (let n of nodes)
        {
            this.SetActive(n, enable);
        }
    }

    /**
     * Hàm này convert vị trí của fromThis sang NodeSpace của toThis
     * @param convertThis sẽ convert Node này
     * @param toThis sang NodeSpace của Node này
     */
    public static GetConvertedNodePosition(convertThis: cc.Node, toThis: cc.Node): cc.Vec2
    {
        let w = convertThis.parent.convertToWorldSpaceAR(convertThis.getPosition());
        return toThis.parent.convertToNodeSpaceAR(w);
    }

    /**
     * Hàm này sẽ set vị trí của Node moveThis sang vị trí của Node toThis
     * @param moveThis Node cần set vị trí
     * @param toThis Node cần lấy vị trí
     */
    public static SetNodePositionFromNode(moveThis: cc.Node, toThis: cc.Node)
    {
        // Lấy ra vị trí của ToThis là bao nhiêu khi so với moveThis
        let newPos = this.GetConvertedNodePosition(toThis, moveThis);

        // Gán vị trí đó cho moveThis
        moveThis.setPosition(newPos);
    }
}

export class Helper
{
    public static uniqueString(): string
    {
        let thisTime = new Date();
        return `${thisTime.getHours}${thisTime.getMinutes}${thisTime.getSeconds}${thisTime.getMilliseconds}`;
    }
}

export class Assert
{
    /**
     * Kiểm tra obj nào đó có null không?
     * @param sender Node gửi yêu cầu
     * @param obj obj cần kiểm tra
     */
    public static isNotNull(sender: cc.Node, obj: any): boolean
    {
        if (CC_DEBUG && (obj == null || cc.js.isEmptyObject(obj)))
        {
            cc.log(sender);
            cc.error("Object mang giá trị null. Sender: " + sender.name);
            return false;
        }
        return true;
    }

    /**
     * Kiểm tra 1 Array nào đó có phần tử bên trong không?
     * @param sender Node gửi yêu cầu
     * @param obj obj cần kiểm tra
     */
    public static isNotEmpty(sender: cc.Node, obj: any[]): boolean
    {
        if (CC_DEBUG && (!obj || obj.length == 0))
        {
            cc.log(sender);
            cc.error("Array bị rỗng: Sender: " + sender.name);
            return false;
        }
        return true;
    }

    /**
     * Kiểm tra 1 biểu thức nào đó có đúng không?
     * @param sender Node gửi yêu cầu
     * @param expression Biểu thức cần kiểm tra tính đúng đắn
     */
    public static isTrue(sender: cc.Node, expression: boolean): boolean
    {
        if (CC_DEBUG && !expression)
        {
            cc.log(sender);
            cc.error("Phép kiểm tra cho kết quả sai. Sender: " + sender.name);
            return false;
        }

        return true;
    }
}