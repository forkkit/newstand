/**
 * The Util service is for thin, globally reusable, utility functions
 */

export default class Utils {
    
    /**
     * Return hostname from url string
     *
     * @param  {String} url - the url to parse
     * @return {Function}
     */
    static extractHost(url:string){
        let hostname;

        if (url.indexOf("://") > -1) {
            hostname = url.split('/')[2];
        }
        else {
            hostname = url.split('/')[0];
        }

        hostname = hostname.split(':')[0];
        hostname = hostname.split('?')[0];

        return hostname;
    }
    

    
}