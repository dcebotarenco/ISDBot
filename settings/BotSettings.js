/**
 * Created by dcebotarenco on 10/10/2016.
 */
class BotSettings {
    constructor(map)
    {
        this._map = map
    }

    getValueByKey(key)
    {
        return this._map.get(key);
    }
}
module.exports = BotSettings;